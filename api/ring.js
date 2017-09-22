var RingAPI = require('doorbot');
var ringUser = process.env.ringUser || "";
var ringPass = process.env.ringPass || "";
var devices = require("../config/devices.json");
var dispatch = require("../lib/dispatch");

const ring = RingAPI({
    email: ringUser,
    password: ringPass
});;

function register(callback) {
    if (ringUser == "") {
        return callback();
    }
    eventMonitor(callback);
}

function listDevices(callback) {
    var list = {};
    Object.keys(devices.ring).forEach(function (id) {
        var device = devices.ring[id];
        if (device.type == "switch") {
            device.onUrl = "ring/" + id + "/on";
            device.offUrl = "ring/" + id + "/off";
            device.toggle = "ring/" + id + "/toggle";
            device.status = "unknown";
            list[id] = device;
        }
    });
    return callback(null, list);
}

function getStatusOfDevice(id, callback, cached) {

    if (arguments.length == 2) {
        cached = false;
    }

    if (isValidDeviceId(id) === false) {
        return callback("Invalid Device");
    }

    if (devices.ring[id].hasManualOverride || cached) { //check the status in real time
        ring.devices(function (err, d) {
            if (d && d.hasOwnProperty("stickup_cams")) {
                
            } else {
                return callback(err, "off");
            }
            var device = d.stickup_cams.find(function (el) {
                return el.id == id;
            });
            var status = "off";
            if (device && device.led_status && device.led_status == "on") {
                status = "on";
            }
            return callback(err, status)
        });
    } else {
        dispatch.devices(function (err, d) {
            if (d.hasOwnProperty(id)) {
                return callback(err, d[id].status);
            } else {
                return callback(err, "off");
            }
        });
    }

}

function setStatusOfDevice(id, status, callback) {
    if (isValidDeviceId(id) === false) {
        return callback("Invalid Device");
    }

    if (status == "on") {
        ring.lightOn({ id: id }, function (err) {
            if (!err) {
                dispatch.setStatus(id, status);
            }
            return callback(err);
        });
    } else if (status == "off") {
        ring.lightOff({ id: id }, function (err) {
            if (!err) {
                dispatch.setStatus(id, status);
            }
            return callback(err);
        });
    } else if (status == "toggle") {

        getStatusOfDevice(id, function (err, status) {
            if (status == "on") {
                ring.lightOff({ id: id }, function (err) {
                    if (!err) {
                        dispatch.setStatus(id, "off");
                    }
                    return callback(err);
                });
            } else {
                ring.lightOn({ id: id }, function (err) {
                    if (!err) {
                        dispatch.setStatus(id, "on");
                    }
                    return callback(err);
                });
            }
        });
    }
}

function isValidDeviceId(id) {
    if (devices.ring.hasOwnProperty(id) === false) {
        return false;
    }
    var device = devices.ring[id];
    if (!(device.type === "switch")) {
        return false;
    }
    if (device.enabled === false) {
        return false;
    }
    return true;
}

var eventMonitor = function (callback) {
    var seen = [];
    async.forever(function (restart) {

        ring.dings(function (err, rings) {
            if (!err) {
                rings.forEach(function (event) {
                    if (seen.indexOf(event.id) == -1) {
                        //new event!
                        var name = event.doorbot_description;
                        var type = event.kind;
                        seen.push(event.id);
                        lib.motion.fired(devices.ring[name]);
                    }
                });
            }
            setTimeout(function () {
                return restart(err);
            }, 2500);
        });

    });

    callback();
}

module.exports.register = register;
module.exports.setStatusOfDevice = setStatusOfDevice;
module.exports.getStatusOfDevice = getStatusOfDevice;
module.exports.listDevices = listDevices;
