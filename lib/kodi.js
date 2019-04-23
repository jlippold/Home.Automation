var async = require('async');
var nodeUtil = require('util');
var request = require('request');
var devices = require("../devices/").kodi;
var kodi = require("../lib/kodi");
var spawn = require('child_process').spawn;

module.exports.rpc = rpc;
module.exports.nowPlaying = nowPlaying;
module.exports.getImage = getImage;
module.exports.play = play;
module.exports.episodes = episodes;
module.exports.runSSHCommand = runSSHCommand;
module.exports.playChannelByName = playChannelByName;

function runSSHCommand(device, command, callback) {
    command = "ssh " + device.hostname + " '" + command + "'";
    console.log("Rebooting", command);
    var bash = spawn("bash.exe", ["-c", command], { cwd: "C:\\Windows\\Sysnative", windowsHide: true });
    bash.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    bash.stderr.on('data', function (data) {
        console.error(data.toString());
    });
    bash.on('close', function (code) {
        return callback();
    });
}

function getImage(room, image, res) {

    var device = devices[room];
    image = encodeURIComponent(image);
    //console.error(`http://${device.ip}/image/${image}`);
    var options = {
        url: `http://${device.ip}/image/${image}`,
        auth: {
            user: process.env.KODI_USER,
            password: process.env.KODI_PASS
        }
    };
    request(options).pipe(res);
}

function rpc(room, command, replacements, callback) {
    //console.log(room, command, replacements);
    if (!devices.hasOwnProperty(room)) {
        console.error("invalid room", room, command);
        return callback("invalid room");
    }

    var device = devices[room];
    if (!device) {
        return callback("Could not find device");
    }

    var json = JSON.stringify(device.commands[command]);
    if (!json) {
        return callback("Could not find json command: " + command);
    }

    var uri = "http://" + device.ip + "/jsonrpc";
    replacements.forEach(function (item) {
        var re = new RegExp(`${item.name}`, "g");
        json = json.replace(re, item.value);
    });
    //console.error(uri);

    var options = {
        url: uri,
        body: JSON.parse(json),
        auth: {
            user: process.env.KODI_USER,
            password: process.env.KODI_PASS
        },
        json: true
    };

    request.post(options, function (err, res, body) {
        //console.log(err, body);
        if (err) console.error(err);
        return callback(err, body);
    });
}

function episodes(room, showid, callback) {
    var replacements = [
        { name: '"%show_id%"', value: showid }
    ];

    rpc(room, "_getEpisodes", replacements, callback);
}

function playChannelByName(room, channelName, callback) {
    rpc(room, "_getLiveTV", [], function (err, data) {
        var channel = data.result.channels.find(function(channel) {
            return channel.label == channelName;
        });
        //console.log("playChannelByName", room, channelName, channel);
        if (channel) {
            play(room, "channelid", channel.channelid, callback);
        } else {
            return callback("Cannot find channel");
        }
    });
}

function play(room, type, id, callback) {
    var replacements = [
        { name: '"%item_id%"', value: id },
        { name: '%type%', value: type }
    ];

    rpc(room, "_play", replacements, callback);
}

function nowPlaying(room, done) {
    var state = {
        playerid: -1,
        percentage: 0,
        title: null,
        type: null,
        image: "/img/kodi-dark.jpg",
        commands: [],
        item: {}
    };

    async.auto({
        getPlayer: function (callback) {
            state.commands = Object.keys(devices[room].commands).filter(function (command) {
                return (command.substring(0, 1) != "_")
            });

            rpc(room, "_activePlayers", [], function (err, data) {
                if (data && data.result && data.result.length > 0) {
                    state.playerid = data.result[0].playerid;
                    callback(err);
                } else {
                    callback("nill");
                }
            });
        },
        getNowPlaying: ["getPlayer", function (callback, results) {
            rpc(room, "_nowPlaying", [{ name: '"%playerid%"', value: state.playerid }], function (err, data) {
                if (data && Array.isArray(data) && data.length == 2) {
                    if (!data[0].result) {
                        return callback("nill");
                    }
                    state.percentage = data[0].result.percentage;
                    callback(err, data[1].result.item);
                } else {
                    callback("nill");
                }
            });
        }],
        fixUnknownType: ["getNowPlaying", function (callback, results) {
            var item = results.getNowPlaying;
            if (item.type == "unknown" && item.file) {
                var filename = item.file.split("/").pop();
                var pathname = item.file
                    .substring(0, item.file.indexOf(filename) - 1)
                    .split("/")
                    .pop();

                var replacements = [
                    { name: "%filename%", value: filename },
                    { name: "%pathname%", value: pathname }
                ];
                // console.error(replacements);
                rpc(room, "_searchByPath", replacements, function (err, data) {
                    if (data && Array.isArray(data) && data.length == 2) {
                        if (
                            data[0].result &&
                            data[0].result.episodes &&
                            Array.isArray(data[0].result.episodes) &&
                            data[0].result.episodes.length > 0
                        ) {
                            return callback(err, data[0].result.episodes[0]);
                        } else if (
                            data[1].result &&
                            data[1].result.movies &&
                            Array.isArray(data[1].result.movies) &&
                            data[1].result.movies.length > 0
                        ) {
                            return callback(err, data[1].result.movies[0]);
                        } else {
                            return callback(err, item);
                        }
                    } else {
                        return callback(err, item);
                    }
                });

            } else if (item.type == "episode" && item.showtitle) {
                item.title = item.showtitle + " " + item.title;
                callback(null, item);
            } else {
                callback(null, item);
            }
        }],
        formatImages: ["fixUnknownType", function (callback, results) {
            var item = results.fixUnknownType;
            var images = item.art;

            //fix image paths, and set primary thumbnail
            var preferredImages = [
                "fanart", "fanart1", "fanart2",
                "clearart", "clearlogo", "landscape", "thumb"
            ];

            item.thumbnail = null;
            preferredImages.forEach(function (key) {
                if (images.hasOwnProperty(key)) {
                    images[key] = "televisions/" + room + "/images/?image=" + encodeURIComponent(images[key]);
                    if (!item.thumbnail) {
                        item.thumbnail = images[key];
                    }
                }
            });

            state.image = item.thumbnail;
            state.title = item.title || item.label;
            state.type = item.type;

            callback(null, item);
        }]
    }, function (err, results) {

        if (err == "nill") {
            return done(null, state);
        }

        if (err) {
            //console.error(err, results);
            return done(err, state);
        }
        if (state.title) {
            state.title = state.title.split("//")[0]
        }
        var item = results.formatImages;
        state.item = item;
        return done(err, state);
    });

}

