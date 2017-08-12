var path = require("path");
var fs = require('fs-extra');
var walk = require('klaw');
var async = require('async');
var moment = require('moment');
var chokidar = require('chokidar');
var sqlite3 = require('sqlite3').verbose();
var lib = require("../lib/");

var db = new sqlite3.Database("recordings.db");

var ftpPath = "G:\\FTP";

module.exports.init = init;

function initdb(callback) {
  db.serialize(function () {
    var createTable = `CREATE TABLE IF NOT EXISTS 
        recordings (mp4 TEXT PRIMARY KEY, 
          location TEXT, jpg TEXT NULL, date DATETIME, 
          gif TEXT NULL, duration TEXT NULL)`;
    db.run(createTable, function (err) {
      callback(err)
    });
  });
  //db.close();
}


function init(callback) {
  initdb(function (err) {
    if (err) {
      return callback(err);
    }

    indexRecordingsOnDisk(function () {

      var paths = cameraBasePaths();
      var watcher = chokidar.watch(paths, {
        ignored: /(^|[\/\\])\../,
        ignoreInitial: ctrue,
        depth: 1
      });

      watcher.on('add', function (filename, stat) {
        if (filename.indexOf(ftpPath) > 0) {

          //TRIGGER MOTION YALL
          console.log(filename);
          var cameraName = path.basename(path.dirname(file)).toLowerCase();
          if (devices.reolink.hasOwnProperty(id)) {
            return callback("no device found");
            lib.motion.fired(devices.reolink[id]);
          }

          setTimeout(function () {
            insertRecordings([filename], function () {
              if (err) {
                console.log(err);
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
    async.eachLimit(items, 3, function (file, next) {

      var name = path.basename(file, path.extname(file));
      var ext = path.extname(file);

      if ((ext == ".mp4") && name.startsWith("01_")) {
        var cameraName = path.basename(path.dirname(file));
        var dateInFile = name.substring(3); //20170805153417
        var fileDate = moment(dateInFile, 'YYYYMMDDHHmmss');

        var jpg = newPathWithExtension(file, ".jpg");
        var sql = `INSERT INTO recordings VALUES (
            $mp4, $location, $jpg, 
            $date, $gif, $duration )`;

        fileExists(jpg, function (exists) {
          jpg = exists ? jpg : null;
          db.run(sql, {
            $mp4: file, $location: cameraName, $jpg: jpg,
            $date: fileDate.toDate(), $gif: null, $duration: null
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