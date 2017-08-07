var path = require("path");
var fs = require('fs-extra');
var walk = require('klaw');
var async = require('async');
var moment = require('moment');

var ftpPath = "G:\\FTP";
var destination = "G:\\cameras";

module.exports.init = startWatcher;

function startWatcher(callback) {
  processAll(function () {
    var paths = cameraBasePaths();
    async.each(paths, function (basePath, next) {
      fs.watch(basePath, { encoding: "utf8" }, function (eventType, filename) {
        if (filename) {
          console.log("new watch emit: ", basePath, filename, eventType);
        }
      });
      next();
    }, function () {
      callback();
    })
  });
}

function processAll() {
  console.log("Moving FTP videos");
  var paths = cameraBasePaths();
  async.each(paths, function (basePath, next) {
    var items = [];
    walk(basePath).on('data', item => items.push(item.path))
      .on('end', () => {
        console.dir(items);
        processItems(items, function () {
          next();
        });
      });
  }, function () {
    callback();
  });
}

function processItems(items, callback) {

  async.eachLimit(items, 10, function (file, next) {
    // Perform operation on file here.
    console.log('Processing file ' + file);
    var name = path.basename(file, path.extname(file));
    var ext = path.extname(file);

    if (ext == ".mp4" && name.substring(0, 2) == "01_") {
      var cameraName = path.basename(path.dirname(file));
      var dateInFile = name.substring(3); //20170805153417
      var fileDate = moment(dateInFile).format('YYYYMMDDHHmmss');

      var dayFolder = fileDate.format("YYYY-MM-DD");
      var newFileName = fileDate.format("hh.mmA - ddd YYYY-MM-DD") + ".mp4";

      var destinationPath = path.join(destination, cameraName, dayFolder);
      var destinationFile = path.join(destinationPath, newFileName);

      console.log("final path: " + destinationFile);

      if (1 == 2) {
        fs.ensureDir(destinationPath, err => {
          console.log(err) // => null
          fs.move(file, destinationFile, { overwrite: true }, err => {
            return next(err);
            console.log('success!')
          })
        });
      }

      //create gif previews ?
      //create jpg ?
      //add to data stored ?
    }
    next();
  }, function (err) {
    if (err) {
      console.log(err);
    }
    callback()
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
