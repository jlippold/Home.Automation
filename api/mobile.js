
var jsonfile = require('jsonfile');
var fs = require('fs');
var moment = require('moment');
var async = require('async');
var path = require('path');
var os = require('os');
var apn = require('node-apn-http2');
var aws = require('../lib/amazon');

module.exports.addDevice = addDevice;
module.exports.getDevices = getDevices;
module.exports.deviceIsRegistered = deviceIsRegistered;
module.exports.sendPushNotification = sendPushNotification;

var mobileDevices = path.join(__dirname, "../mobileDevices.json")


var apnProvider = new apn.Provider({
    token: {
        key: "D://www//pushcerts//authKey.p8",
        keyId: process.env.pushKeyId,
        teamId: process.env.pushTeamId
    },
    production: false
});


function addDevice(deviceId, deviceName, callback) {
    async.auto({
        devices: function (moveNext) {
            getDevices(function (err, mobile) {
                moveNext(err, mobile);
            });
        },
        add: ['devices', function (moveNext, results) {
            var devices = results.devices;
            if (!devices.hasOwnProperty(deviceId)) {
                devices[deviceId] = {
                    id: deviceId,
                    name: deviceName
                };
                return setDevices(devices, moveNext);
            }
            moveNext();
        }]
    }, function (err) {
        callback(err);
    });
}

function getDevices(callback) {
    async.auto({
        fileExists: function (moveNext) {
            fs.access(mobileDevices, fs.F_OK, function (err) {
                if (err) {
                    moveNext(null, false);
                } else {
                    moveNext(null, true);
                }
            });
        },
        readFile: ['fileExists', function (moveNext, results) {
            if (results.fileExists) {
                jsonfile.readFile(mobileDevices, function (err, obj) {
                    moveNext(err, obj);
                });
            } else {
                moveNext(null, {});
            }
        }]
    }, function (err, results) {
        callback(err, results.readFile);
    });
}

function sendPushNotification(image, camera, callback) {

    async.auto({
        upload: function (moveNext) {
            var p = "cams/" + moment().format("YYYY-MM-DD") + "/" + path.basename(image);
            aws.upload(image, p, 'image/gif', function (err, url) {
                moveNext(err, url);
            })
        },
        devices: function (moveNext) {
            getDevices(function (err, mobile) {
                moveNext(err, mobile);
            });
        },
        push: ['upload', 'devices', function (moveNext, results) {
            var note = new apn.Notification();
            note.expiry = Math.floor(Date.now() / 1000) + 600; // Expires 10 mins
            note.topic = "bz.jed.home";
            note.rawPayload = {
                "aps": {
                    "sound": "ping.aiff",
                    "alert": {
                        "title": "Intruder detected",
                        "body": camera + " movement is happening",
                    },
                    "badge": 0,
                    "mutable-content": 1,
                    "content-available": 1
                },
                "mediaUrl": results.upload,
                "mediaType": "gif",
            };

            apnProvider.send(note, Object.keys(results.devices)).then((result) => {
                moveNext()
            });
        }]
    }, function (err, results) {
        if (callback) {
            //console.log("Push results", results);
            callback();
        }
    });
}

function deviceIsRegistered(deviceId, callback) {
    getDevices(function (err, devices) {
        var exists = devices.hasOwnProperty(deviceId);
        callback(err, exists);
    });
}

function setDevices(devices, callback) {
    jsonfile.writeFile(mobileDevices, devices, {
        spaces: 2
    }, callback);
}