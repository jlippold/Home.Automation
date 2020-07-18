var myq = require('myq-node');
var myqUser = process.env.myqUser || "";
var myQPass = process.env.myQPass || "";
var devices = require("../devices/");
var dispatch = require("../lib/dispatch");

//myq.login(myqUser, myQPass)

function listDevices(callback) {

    var list = {};
    return callback(null, list);
    Object.keys(devices.myq).forEach(function (id) {
        var device = devices.myq[id];
        if (device.type == "switch") {
            device.onUrl = "garage/" + id + "/on";
            device.offUrl = "garage/" + id + "/off";
            device.toggle = "garage/" + id + "/toggle";
            device.status = "unknown";
            list[id] = device;
        }
    });
    return callback(null, list);
}

function getStatusOfDevice(id, callback, cached) {
    return callback();
    if (arguments.length == 2) {
        cached = false;
    }

    if (isValidDeviceId(id) === false) {
        return callback("Invalid Device");
    }

    if (devices.myq[id].hasManualOverride || cached) { //check the status in real time
        myq.getState([id]).then(state => {
            var status = "unknown";
            if (state) {
                if (state.code && state.code == 9) {
                    status = "on"
                }
                if (state.code && state.code == 2) {
                    status = "off"
                }
            }
            return callback(null, status)
        }).catch(callback)
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
        myq.openDoor(id).then(door => {
            if (door) {
                dispatch.setStatus(id, "on");
            }
            return callback();
        }).catch(callback)
    } else if (status == "off") {
        myq.closeDoor(id).then(door => {
            if (door) {
                dispatch.setStatus(id, "off");
            }
            return callback();
        }).catch(callback)
    } else if (status == "toggle") {

        getStatusOfDevice(id, function (err, status) {
            if (status == "on") {
                myq.openDoor(id).then(door => {
                    if (door) {
                        dispatch.setStatus(id, "on");
                    }
                    return callback();
                }).catch(callback)
            } else {
                myq.closeDoor(id).then(door => {
                    if (door) {
                        dispatch.setStatus(id, "off");
                    }
                    return callback();
                }).catch(callback)
            }
        });
    }
}

function isValidDeviceId(id) {
    if (devices.myq.hasOwnProperty(id) === false) {
        return false;
    }
    var device = devices.myq[id];
    if (!(device.type === "switch")) {
        return false;
    }
    if (device.enabled === false) {
        return false;
    }
    return true;
}


module.exports.setStatusOfDevice = setStatusOfDevice;
module.exports.getStatusOfDevice = getStatusOfDevice;
module.exports.listDevices = listDevices;
