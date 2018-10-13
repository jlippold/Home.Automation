module.exports.runAlexaAction = runAlexaAction;
module.exports.findByTitle = findByTitle;

var spawn = require('child_process').spawn;
var api = require("../api/");
var lib = require("../lib/");
var fs = require('fs-extra');
var Stream = require('stream').Transform;
var spawn = require('child_process').execFile;
var path = require("path");

function runAlexaAction(deviceType, status, callback) {
    var currentAlexa;
    var bash = spawn("bash.exe", ["-c", 'bash ~/alexa_remote_control.sh -lastalexa'], { cwd: "C:\\Windows\\Sysnative", windowsHide: true });

    bash.stdout.on('data', function(data) {
        currentAlexa = data.toString();
        bash.kill();
    });

    bash.on('close', function(code) {
        currentAlexa = currentAlexa.replace(/(\r\n\t|\n|\r\t)/gm, "").trim();

        var deviceMap = getDeviceMap();
        var action = deviceMap.find(function(d) {
            if (d.alexas.indexOf(currentAlexa) > -1) {
                if (d.devices.hasOwnProperty(deviceType)) {
                    return d;
                }
            }
        });

        //console.log("alexa", currentAlexa, deviceType, status, action);
        if (action) {
            return action.devices[deviceType](currentAlexa, status, callback);
        } else {
            console.error("Error finding device", currentAlexa, deviceType, status);
            return callback("Unknown Room");
        }
    });

}

function getDeviceMap() {
    var calls = [
        {
            alexas: ["Bedroom", "Bathroom"],
            devices: {
                TV: function(device, status, callback) {
                    lib.groups.setStatus("br-tv", status, callback)
                },
                Disney: function(device, status, callback) {
                    lib.kodi.playChannelByName("Bedroom", "Disney Junior", callback);
                },
                CNN: function(device, status, callback) {
                    lib.kodi.playChannelByName("Bedroom", "CNN", callback);
                }
            }
        },
        {
            alexas: ["Bedroom"],
            devices: {
                Light: function(device, status, callback) {
                    lib.groups.setStatus("bedroom_lights", status, callback)
                }
            }
        },
        {
            alexas: ["Bathroom"],
            devices: {
                Light: function(device, status, callback) {
                    api.insteon.setStatusOfDevice("3C2BBD", status, callback)
                }
            }
        },
        {
            alexas: ["Living room", "Dining Room", "Kitchen"],
            devices: {
                TV: function(device, status, callback) {
                    lib.groups.setStatus("lr-tv", status, callback)
                },
                Disney: function(device, status, callback) {
                    lib.kodi.playChannelByName("Living", "Disney Junior", callback);
                },
                CNN: function(device, status, callback) {
                    lib.kodi.playChannelByName("Living", "CNN", callback);
                }
            }
        },
        {
            alexas: ["Office", "Layla", "Basement"],
            devices: {
                TV: function(device, status, callback) {
                    device = device == "Basement" ? "Gym" : device;
                    api.kodi.execute(device, "powerToggle", callback)
                },
                Disney: function(device, status, callback) {
                    device = device == "Basement" ? "Gym" : device;
                    lib.kodi.playChannelByName(device, "Disney Junior", callback);
                },
                CNN: function(device, status, callback) {
                    device = device == "Basement" ? "Gym" : device;
                    lib.kodi.playChannelByName(device, "CNN", callback);
                }
            }
        },
        {
            alexas: ["Living room"],
            devices: {
                Light: function(device, status, callback) {
                    lib.groups.setStatus("livingroom_lights", status, callback)
                }
            }
        },
        {
            alexas: ["Dining Room"],
            devices: {
                Light: function(device, status, callback) {
                    lib.groups.setStatus("dining_room", status, callback)
                }
            }
        },
        {
            alexas: ["Kitchen"],
            devices: {
                Light: function(device, status, callback) {
                    lib.groups.setStatus("kitchen", status, callback)
                }
            }
        }
    ];

    return calls;

}

function findByTitle(title, callback) {
    console.log("alexa stream");

    if (title == "CNN") {
        return liveStream("http://192.168.1.148:5004/auto/v620?transcode=mobile", callback);
    }

    var params = [{ name: "%title%", value: title }];

    lib.kodi.rpc("Bedroom", "_searchByTitle", params, function(err, results) {
        if (err) return callback(err);

        var movies = results.find(function(item) {
            return item.id == "libMovies";
        });

        if (movies && movies.result.movies.length > 0) {
            movie = movies.result.movies[0];
            return liveStream(movie.file, callback);
        }
        return callback("No movie found");
    });
}

var liveStreams = [];
function liveStream(input, callback) {
    var title = "echo";
    var ffmpeg = "D:\\Scripts\\FFMpeg\\ffmpeg.exe";
    var streamPath = "D:\\www\\jed.bz\\stream\\";

    var m3u8 = path.join(streamPath, title + ".m3u8");
    var ts = path.join(streamPath, title + "_%03d.ts");
    var baseUrl = "https://home.jed.bz:999/stream/";
    var output = baseUrl + title + ".m3u8";
    input = input.replace("smb:", "");
    //input = input.replace(/ /g, "^ ");

    var args = ["-i", `"${input}"`,
        "-c:v", "libx264",
        "-c:a", "aac",
        "-start_number", "0",
        "-hls_time", "2",
        "-crf", "32",
        "-hls_list_size", "6",
        "-segment_list_flags", "live",
        "-vf", "scale=-1:720",
        "-hls_flags", "delete_segments",
        "-hls_base_url", baseUrl,
        "-hls_segment_filename", ts,
        "-f", "hls", m3u8
    ];

    //console.log(ffmpeg + " " + args.join(" "));

    if (liveStreams.indexOf(title) != -1) {
        //already streaming
        console.log("already streaming");
        callback(null, output);
        callback = null;
        return;
    }

    //spawn("DEL", ["/Q", "/F", "/S", streamPath + title + "*.*"], { windowsHide: true, shell: true});

    fs.remove(m3u8, err => {

        liveStreams.push(title);
        var stream = spawn(ffmpeg, args, { windowsHide: true, shell: true });


        stream.on('close', (code) => {
            if (callback) {
                callback("FFMPEG Failed to create stream");
                callback = null;
                return;
            }
            //remove from lookup array
            var index = liveStreams.indexOf(title);
            if (index !== -1) {
                liveStreams.splice(index, 1);
            }
        });

        setTimeout(function() {
            //kill ffmpeg after 30 minutes of streaming
            if (stream) {
                stream.kill('SIGKILL');
            }
        }, 30 * 60 * 1000);

        var attempts = 0;
        var interval = setInterval(function() {
            //wait until m3u8 exists
            fs.stat(m3u8, function(err, stats) {
                if (err) {
                    //fie doesn't exist yet
                    attempts++;
                    if (attempts > 20) {
                        if (interval) clearInterval(interval);
                        if (callback) return callback(err, output);
                    }
                } else {
                    if (interval) clearInterval(interval);
                    setTimeout(() => {
                        if (callback) return callback(err, output);
                    }, 1000);
                }
            });
        }, 1000);

    });

}