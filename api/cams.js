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
var moment = require('moment');
var glob = require("glob");

var devices = require("../devices/");
var reoLinkPassword = process.env.reoLinkPassword || "";

var db = new sqlite3.Database("recordings.db");

var ftpPath = "G:\\FTP";
var ffmpeg = "D:\\Scripts\\FFMpeg\\ffmpeg.exe";
var streamPath = "D:\\www\\jed.bz\\stream\\";
var camRoot = path.join(streamPath, "gif\\")
var watcher;



var cams = [
  { ip: "192.168.1.201", name: "garage" },
  { ip: "192.168.1.202", name: "basement" },
  { ip: "192.168.1.203", name: "sidedoor" },
  { ip: "192.168.1.204", name: "porch" },
  { ip: "192.168.1.205", name: "driveway" },
  { ip: "192.168.1.206", name: "swings" },
  { ip: "192.168.1.207", name: "generator" }
];

cams = cams.map(function (cam) {
  cam.streamLow = "rtsp://admin:" + reoLinkPassword + "@" + cam.ip + "/h264Preview_01_sub";
  cam.streamHigh = "rtsp://admin:" + reoLinkPassword + "@" + cam.ip + "/h264Preview_01_main";
  return cam;
});

module.exports.cameras = cams;
module.exports.init = init;
module.exports.getRecordings = getRecordings;
module.exports.getRecordingById = getRecordingById;
module.exports.getBase64Picture = getBase64Picture;
module.exports.liveStream = liveStream;
module.exports.createGif = createGif;
module.exports.createMP4 = createMP4;

function initdb(callback) {

  db.serialize(function () {
    var createTable = `CREATE TABLE IF NOT EXISTS 
        recordings (recording_id TEXT, mp4 TEXT PRIMARY KEY, 
          location TEXT, jpg TEXT NULL, date DATETIME, dateString TEXT,
        CONSTRAINT id_unique UNIQUE (recording_id))`;
    db.run(createTable, function (err) {


    });
  });

  //db.close();

}

var liveStreams = [];

function liveStream(cam, local, callback) {

  var m3u8 = path.join(streamPath, cam.name + ".m3u8");
  var ts = path.join(streamPath, cam.name + "_%03d.ts");

  var args = ["-i", local ? cam.streamHigh : cam.streamLow,
    "-c:v", "copy",
    "-c:a", "copy",
    "-start_number", "0",
    "-g", "60",
    "-hls_time", "2",
    "-hls_list_size", "2",
    "-segment_list_flags", "live",
    "-hls_flags", "delete_segments",
    "-hls_base_url", "https://home.jed.bz:999/stream/",
    "-hls_segment_filename", ts,
    "-f", "hls", m3u8
  ];

  if (liveStreams.indexOf(cam.name) != -1) {
    //already streaming
    return callback();
  }

  fs.remove(m3u8, err => {
    if (err) return callback(err);

    liveStreams.push(cam.name);
    var stream = spawn(ffmpeg, args, { windowsHide: true });

    stream.on('close', (code) => {
      //remove from lookup array
      var index = liveStreams.indexOf(cam.name);
      if (index !== -1) {
        liveStreams.splice(index, 1);
      }
    });

    setTimeout(function () {
      //kill ffmpeg after 5 minutes of streaming
      if (stream) {
        stream.kill('SIGKILL');
      }

    }, 3 * 60 * 1000);

    var interval = setInterval(function () {
      //wait until m3u8 exists
      fs.stat(m3u8, function (err, stats) {
        if (!err) {
          if (interval) {
            clearInterval(interval);
          }
          return callback(err)
        }
      })
    }, 1000)
  });


}

function createGif(cam, night, callback) {
  var gifName = cam.name + "_" + moment().format("YYYY-MM-DD-HH-mm-ss.SSS") + ".gif";
  var base = path.join(streamPath, "gif\\")
  var gif = path.join(base, gifName);
  var palette = path.join(base, cam.name + (night ? "_dark" : "_light") + ".png");

  var makeGif = function (done) {
    var gifArgs = [
      "-y", "-t", "3", "-i", cam.streamLow, "-i", palette,
      "-filter_complex", "fps=10,scale=0:-1:flags=lanczos[x];[x][1:v]paletteuse", gif
    ];
    var gifStream = spawn(ffmpeg, gifArgs, { windowsHide: true });
    console.log("Creating gif: ", ffmpeg, gifArgs.join(" "));
    gifStream.on('close', (code) => {
      done(null, gif);
    });
  }

  fs.stat(palette, function (err, stats) {
    var needsPalette = false;
    if (err) {
      needsPalette = true; //404
    } else {
      var secondsOld = (new Date().getTime() - stats.mtime) / 1000;
      if (secondsOld > (60 * 60 * 6)) {
        needsPalette = true;
      }
    }

    if (needsPalette) {
      var args = [
        "-y", "-t", "3", "-i", cam.streamLow,
        "-vf", "fps=10,scale=0:-1:flags=lanczos,palettegen",
        palette
      ];
      var paletteStream = spawn(ffmpeg, args, { windowsHide: true });
      //console.log("Gif palette: ", ffmpeg, args.join(" "));
      paletteStream.on('close', (code) => {
        makeGif(callback);
      });
    } else {
      makeGif(callback);
    }

  });

}

function createMP4(cam, night, callback) {
  var fName = cam.name + "_" + moment().format("YYYY-MM-DD-HH-mm-ss.SSS");
  var base = path.join(camRoot, moment().format("YYYY-MM-DD") + "\\");

  var gif = path.join(base, fName + ".gif");
  var mp4 = path.join(base, fName + ".mp4");
  var palette = path.join(camRoot, cam.name + (night ? "_dark" : "_light") + ".png");

  fs.ensureDir(base, function (err) {
    if (err) return callback(err);

  });


  var encode = function (done) {
    //encode to gif and mp4
    var args = [
      "-y", "-i", cam.streamHigh, "-i", palette, "-filter_complex",
      "trim=start=0:end=3,setpts=PTS-STARTPTS,fps=2,scale=320:-2:flags=lanczos[x];[x][1:v]paletteuse",
      gif, "-map", "0:v", "-map", "0:a", "-f", "mp4", "-filter:v", "scale=640:-2", "-vcodec", "libx264",
      "-profile:v", "main", "-acodec", "aac", "-t", "10", mp4
    ];
    var stream = spawn(ffmpeg, args, { windowsHide: true });
    //console.log("Encoding: ", ffmpeg, args.join(" "));
    stream.on('close', (code) => {
      done(null, mp4);
    });
  }

  fs.stat(palette, function (err, stats) {
    var needsPalette = false;
    if (err) {
      needsPalette = true; //404
    } else {
      var secondsOld = (new Date().getTime() - stats.mtime) / 1000;
      if (secondsOld > (60 * 60 * 6)) {
        needsPalette = true;
      }
    }

    if (needsPalette) {
      var args = [
        "-y", "-t", "3", "-i", cam.streamHigh,
        "-vf", "fps=10,scale=0:-1:flags=lanczos,palettegen",
        palette
      ];
      var paletteStream = spawn(ffmpeg, args, { windowsHide: true });
      //console.log("Gif palette: ", ffmpeg, args.join(" "));
      paletteStream.on('close', (code) => {
        encode(callback);
      });
    } else {
      encode(callback);
    }

  });

}

var downloader = function (callback) {
  if (reoLinkPassword == "") {
    return;
  }

  cams.forEach(function (cam) {
    async.forever(
      function (restart) {
        var pic = path.join(ftpPath, cam.name + ".jpg");

        var args = ["-i", cam.streamLow,
          "-vf", "fps=fps=1", "-update", "1", pic, "-y"];
        var ls = spawn(ffmpeg, args, { windowsHide: true });
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
              if (err) {
                return ls.kill('SIGKILL');
              }
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
          setTimeout(function () {
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

function getRecordings(callback) {

  glob(path.join(camRoot, "/**/*.gif"), function (err, files) {
    if (err) return callback(err);
    var out = {};
    files.forEach(function (file) {
      var day = path.basename(path.dirname(file));
      var name = path.parse(path.basename(file)).name;

      if (name.indexOf("_20") > -1) {
        var location = name.split("_")[0];
        var timestamp = name.split("_")[1];

        if (!out.hasOwnProperty(day)) {
          out[day] = [];
        }
        out[day].push({ day, location, filename: name, timestamp });
      }
    });

    out.days = Object.keys(out).sort();
    callback(err, { events: out });
  })

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

  downloader();
  picBroadcaster();
  return callback();


  initdb(function (err) {
    if (err) {
      console.log(err);
      return callback(err);
    }

    indexRecordingsOnDisk(function () {
      return callback();
      var paths = cameraBasePaths();
      watcher = chokidar.watch(paths, {
        ignoreInitial: true,
        depth: 1,
        persistent: true
      });

      watcher.on('add', function (filename, stat) {
        if (filename.indexOf(ftpPath) == 0) {
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