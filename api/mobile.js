
var jsonfile = require('jsonfile');
var fs = require('fs');
var moment = require('moment');
var async = require('async');
var path = require('path');
var os = require('os');
var apn = require('apn');


module.exports.addDevice = addDevice;
module.exports.getDevices = getDevices;
module.exports.deviceIsRegistered = deviceIsRegistered;
module.exports.sendPushNotification = sendPushNotification;

var mobileDevices = path.join(__dirname, "../mobileDevices.json")

var apnProvider = new apn.Provider({
    cert: "D://www//pushcerts//cert.pem",
    key: "D://www//pushcerts//key.pem",
    passphrase: process.env.pushPassphrase,
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

function sendPushNotification(image, location, callback) {

    getDevices(function (err, devices) {

        var note = new apn.Notification();

        note.rawPayload = {
            "aps": {
                "sound": "ping.aiff",
                "alert": {
                    "title": "Intruder detected",
                    "body": "Movement is happening on the " + location,
                },
                "badge": 0,
                "mutable-content": 1,
                "content-available": 1
            },
            "mediaUrl": "https://jed.bz/stream/gif/" + image,
            "mediaType": "jpg",
        };
        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.topic = "bz.jed.home";

        apnProvider.send(note, Object.keys(devices)).then((result) => {
            // see documentation for an explanation of result
        });
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