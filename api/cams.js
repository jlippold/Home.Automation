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
var spawn = require('child_process').execFile;
var RingAPI = require('doorbot');

var devices = require("../config/devices.json");

var ringUser = process.env.ringUser || "username@no.com";
var ringPass = process.env.ringPass || "somePass";
var reoLinkPassword = process.env.reoLinkPassword || "";

var db = new sqlite3.Database("recordings.db");

var ftpPath = "G:\\FTP";
var ffmpeg = "D:\\Scripts\\FFMpeg\\ffmpeg.exe";
var watcher;

const ring = RingAPI({
  email: ringUser,
  password: ringPass
});

    
var cams = [
  { ip: "192.168.1.201", name: "garage" },
  { ip: "192.168.1.202", name: "basement" },
  { ip: "192.168.1.203", name: "sidedoor" },
  { ip: "192.168.1.204", name: "porch" },
  { ip: "192.168.1.205", name: "driveway" }
];


module.exports.init = init;
module.exports.getRecordingsForDay = getRecordingsForDay;
module.exports.getRecordingById = getRecordingById;
module.exports.getBase64Picture = getBase64Picture;

function initdb(callback) {
  db.serialize(function () {
    var createTable = `CREATE TABLE IF NOT EXISTS 
        recordings (recording_id TEXT, mp4 TEXT PRIMARY KEY, 
          location TEXT, jpg TEXT NULL, date DATETIME, dateString TEXT,
        CONSTRAINT id_unique UNIQUE (recording_id))`;
    db.run(createTable, function (err) {

      downloader(function () {
        picBroadcaster();
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
        var pic = path.join(ftpPath, cam.name + ".jpg");

        var args = ["-i",
          "rtsp://admin:" + reoLinkPassword + "@" + cam.ip + "/h264Preview_01_sub",
          "-vf", "fps=fps=1", "-update", "1", pic, "-y"];

        var ls = spawn(ffmpeg, args);
        var interval;

        ls.on('close', (code) => {
          //console.error("connection closed for " + cam.name);
          setTimeout(function () {
            if (interval) {
              clearInterval(interval);
            }
            restart();
          }, 500);
        });

        setTimeout(function () {
          interval = setInterval(function () {
            fs.stat(pic, function (err, stats) {
              var secondsOld = (new Date().getTime() - stats.mtime) / 1000;
              if (secondsOld > 30) {
                //console.error("killing failing connection " + cam.name);
                if (interval) {
                  clearInterval(interval);
                }
                ls.kill('SIGKILL');
              }
            });
          }, 5000);
        }, 5000);

      },
      function (err) {
        console.log("recorder crashed");
        console.error(err);
      }
    );
  });
  motionDetector(callback);
}

var motionDetector = function (callback) {
  if (process.env.NODE_ENV != "production") {
    return;
  }
  var seen = [];
  async.forever(function (restart) {

    ring.dings(function (err, rings) {
      if (err) {
        console.error("ring error: ", err)
      } else {
        rings.forEach(function (event) {
          if (seen.indexOf(event.id) == -1) {
            //new event!
            var name = event.doorbot_description;
            var type = event.kind;
            seen.push(event.id);
            lib.motion.fired(devices.ring[name]);
            console.log("Ring motion fired: " + name);
          }
        });
      }
      setTimeout(function () {
        //console.log("fired ring again", rings);
        return restart();
      }, 2500);
    });

  });

  callback();
}

var picBroadcaster = function () {
  async.forever(function (restart) {
    if (lib.dispatch.hasClients()) {
      async.eachLimit(cams, 1, function (cam, next) {
        getBase64Picture(cam.name, function (err, base64) {
          if (err) {
            //console.error("err in base64 pic: ", err);
          } else {
            if (base64.length > 100) { //dont dispatch blanks
              lib.dispatch.picture(cam.name, base64);
              //console.log("Dispatched: ", cam.name);
            }
          }
          setTimeout(function() {
            next();
          }, 100);
        });
      }, function (err) {
        setTimeout(function () {
          restart();
        }, 750);
      });
    } else {
      setTimeout(function () {
        restart();
      }, 2000);
    }
  });
}


function getBase64Picture(cam, callback) {
  var pic = path.join(ftpPath, cam + ".jpg");
  fs.readFile(pic, { encoding: 'base64' }, callback);
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

  if (process.env.NODE_ENV != "production") {
    return callback();
  }
  
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
          //console.log("New file created: " + filename);
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

      if (ext == ".mp4") {
        var cameraName = path.basename(path.dirname(file));
        var dateInFile = "";
        if (name.startsWith("01_")) {
          dateInFile = name.substring(3); //20170805153417
        } else {
          dateInFile = name.substring(3 + cameraName.length + 1);
        }

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