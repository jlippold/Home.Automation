var path = require("path");
var fs = require('fs-extra');
var walk = require('klaw');
var async = require('async');
var moment = require('moment');
var chokidar = require('chokidar');
var sqlite3 = require('sqlite3').verbose();
var lib = require("../lib/");
var crypto = require("crypto");
var request = require("request");
var Stream = require('stream').Transform;
var dispatch = require("../lib/dispatch");
var spawn = require('child_process').spawn;
var reoLinkPassword = process.env.reoLinkPassword || "";

var db = new sqlite3.Database("recordings.db");

var ftpPath = "G:\\FTP";
var ffmpeg = "D:\\Scripts\\FFMpeg\\ffmpeg.exe";
var watcher;

var cams = [
  {ip: "192.168.1.201", name: "garage"},
  {ip: "192.168.1.202", name: "basement"},
  {ip: "192.168.1.204", name: "porch"},
  {ip: "192.168.1.205", name: "driveway"}
];


module.exports.init = init;
module.exports.getRecordingsForDay = getRecordingsForDay;
module.exports.getRecordingById = getRecordingById;

function initdb(callback) {
  db.serialize(function () {
    var createTable = `CREATE TABLE IF NOT EXISTS 
        recordings (recording_id TEXT, mp4 TEXT PRIMARY KEY, 
          location TEXT, jpg TEXT NULL, date DATETIME, dateString TEXT,
        CONSTRAINT id_unique UNIQUE (recording_id))`;
    db.run(createTable, function (err) {
      downloader(function () {
        callback(err);
      });
    });
  });

  //db.close();

}

var downloader = function (callback) {
  if (reoLinkPassword == "") {
    return;
  }

  cams.forEach(function (cam) {
    async.forever(
      function (restart) {
        var args = ["-i",
        "rtsp://admin:" + reoLinkPassword + "@" + cam.ip + "/h264Preview_01_sub", 
        "-vf", "fps=fps=1/2", "-update", "1", 
        path.join(ftpPath, cam.name + ".jpg"), "-y"];

        var ls = spawn(ffmpeg, args);
        ls.on('close', (code) => {
          setTimeout(function() {
            restart();
          }, 2000);
        });
      },
      function (err) {
        console.log("recorder crashed");
        console.error(err);
      }
    );
  });
  callback();
}

function getRecordingsForDay(dateString, callback) {
  var sql = "SELECT * FROM recordings where dateString = $dateString ORDER BY date DESC";
  db.all(sql, { $dateString: dateString }, function (err, rows) {
    var output = { recordings: [] };
    if (rows) {
      output.recordings = rows.map(function (row) {
        row.fullDate = moment(row.date).format("dddd, MMMM Do YYYY, h:mm:ss a");
        row.time = moment(row.date).format("hA");
        row.thumbnail = "https://jed.bz/camera/live/getThumbnail.aspx?width=120&file=" + row.jpg
        row.image = "https://jed.bz/home/cameras/recordings/" + row.recording_id + "/image"
        row.video = "https://jed.bz/home/cameras/recordings/" + row.recording_id + "/video"
        return row;
      });
    }
    callback(err, output);
  });
}

function getRecordingById(recording_id, callback) {
  var sql = "SELECT * FROM recordings where recording_id = $recording_id";
  db.all(sql, { $recording_id: recording_id }, function (err, rows) {
    if (err) {
      return callback(err);
    }
    if (rows && rows.length > 0) {
      callback(err, rows[0]);
    } else {
      callback(err);
    }
  });
}

function init(callback) {
  initdb(function (err) {
    if (err) {
      console.log(err);
      return callback(err);
    }

    indexRecordingsOnDisk(function () {

      var paths = cameraBasePaths();
      watcher = chokidar.watch(paths, {
        ignoreInitial: true,
        depth: 1,
        persistent: true
      });

      watcher.on('add', function (filename, stat) {
        if (filename.indexOf(ftpPath) == 0) {
          console.log("New file created: " + filename);
          //TRIGGER MOTION YALL

          /*
          var cameraName = path.basename(path.dirname(file)).toLowerCase();
          if (devices.reolink.hasOwnProperty(id)) {
            return callback("no device found");
            lib.motion.fired(devices.reolink[id]);
          }
          */

          setTimeout(function () {
            insertRecordings([filename], function () {
              if (err) {
                console.log("new file insert error" + err);
              }
            });
          }, 1000);
        }
      });

      callback();
    });
  })
}

function indexRecordingsOnDisk(callback) {
  var paths = cameraBasePaths();
  async.each(paths, function (basePath, next) {
    var items = [];
    walk(basePath).on('data', item => items.push(item.path))
      .on('end', () => {
        insertRecordings(items, function () {
          next();
        });
      });
  }, function () {
    callback();
  });
}

function insertRecordings(items, callback) {

  db.serialize(function () {
    async.eachLimit(items, 20, function (file, next) {

      var name = path.basename(file, path.extname(file));
      var ext = path.extname(file);

      if ((ext == ".mp4") && name.startsWith("01_")) {
        var cameraName = path.basename(path.dirname(file));
        var dateInFile = name.substring(3); //20170805153417
        var fileDate = moment(dateInFile, 'YYYYMMDDHHmmss');

        var jpg = newPathWithExtension(file, ".jpg");
        var sql = `INSERT INTO recordings VALUES (
            $id, $mp4, $location, $jpg, 
            $date, $dateString )`;

        fileExists(jpg, function (exists) {
          jpg = exists ? jpg : null;
          var id = crypto.randomBytes(16).toString("hex");
          db.run(sql, {
            $id: id, $mp4: file, $location: cameraName, $jpg: jpg,
            $date: fileDate.toDate(), $dateString: fileDate.format('YYYY-MM-DD')
          }, function (err) {
            err = err && JSON.stringify(err).indexOf("CONSTRAINT") > 0 ? null : err;
            return next(err);
          });
        });
      } else {
        return next();
      }
    }, function (err) {
      if (err) {
        console.log(err);
      }
      //db.close();
      callback(err);
    });
  });
}

function cameraBasePaths() {
  return cameraNames().map(function (cam) {
    return path.join(ftpPath, cam);
  });
}

function cameraNames() {
  return fs.readdirSync(ftpPath).filter(function (file) {
    return fs.statSync(ftpPath + "/" + file).isDirectory();
  });
}

function newPathWithExtension(filename, ext) {
  var nameWithoutExt = path.basename(filename, path.extname(filename));
  var dir = path.dirname(filename)
  return path.join(dir, nameWithoutExt + ext);
}

function fileExists(filename, callback) {
  fs.stat(filename, function (err, stat) {
    if (err && err.code == 'ENOENT') {
      return callback(false);
    }
    return callback(true);
  });
}