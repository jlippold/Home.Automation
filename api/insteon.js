var Insteon = require('home-controller').Insteon;
var async = require('async');
var nodeUtil = require('util');
var moment = require('moment');
var devices = require("../devices/");
var motion = require("../lib/motion");
var keypad = require("../lib/keypad");
var pool = require("../lib/pool");
var dispatch = require("../lib/dispatch");

var hub = new Insteon();

module.exports.register = register;
module.exports.setStatusOfDevice = setStatusOfDevice;
module.exports.getStatusOfDevice = getStatusOfDevice;
module.exports.dim = dim;
module.exports.listDevices = listDevices;


function register(callback) {

	var motionDevices = getInsteonDevicesByType("motion");
	motionDevices.forEach(function (id) {
		var device = hub.motion(id);
		device.on('motion', function () {

			var d = devices.insteon[id];
			console.log(
				nodeUtil.format(
					"%s motion detected at %s",
					d.description,
					moment().format("LLL")
				)
			);

			motion.fired(d);
		});
	});

	var doors = getInsteonDevicesByType("door");
	doors.forEach(function (id) {
		var device = hub.door(id);
		device.on('closed', function () {
			var d = devices.insteon[id];
			console.log(
				nodeUtil.format(
					"%s opened at %s",
					d.description,
					moment().format("LLL")
				)
			);
			motion.fired(d);
		});
	});

	var keypads = getInsteonDevicesByType("keypad");
	keypads.forEach(function (id) {
		var toggle = hub.light(id);

		function registerButtonPress(digit, y) {
			console.log(digit, y);
			var d = devices.insteon[id];
			keypad.pressed(d, digit);
		}
		toggle.on('turnOn', registerButtonPress);
		toggle.on('turnOff', registerButtonPress);
	});

	var config = {
		host: devices.hub.ip,
		port: 25105,
		user: process.env.insteonUser,
		password: process.env.insteonPass,
	};
	hub.httpClient(config, callback);

}

function listDevices(callback) {
	var list = {};
	Object.keys(devices.insteon).forEach(function (id) {

		var device = devices.insteon[id];

		if (device.type == "switch" || device.type == "fan") {
			device.onUrl = "insteon/" + id + "/on";
			device.offUrl = "insteon/" + id + "/off";
			device.toggle = "insteon/" + id + "/toggle";
			device.status = "unknown";
		}

		if (device.type == "motion" || device.type == "door") {
			device.events = [];
		}

		if (device.type != "keypad") {
			list[id] = device;
		}
	});
	return callback(null, list);
}

function getInsteonDevicesByType(type) {
	var arr = [];
	Object.keys(devices.insteon).forEach(function (id) {
		if (devices.insteon[id].type == type) {
			arr.push(id);
		}
	});
	return arr;
}

function getStatusOfDevice(id, callback, cached) {

	if (arguments.length == 2) {
		cached = false;
	}

	if (isValidDeviceId(id) === false) {
		return callback("Invalid Device");
	}

	if (devices.insteon[id].hasManualOverride || cached) { //check the status in real time

		var device = hub.light(id.substring(0, 6)); //remove fan suffix
		if (devices.insteon[id].type === "switch") {
			device.level(function (err, level) {
				if (level > 0) { //is on 
					return callback(err, "on");
				} else { //is off
					return callback(err, "off");
				}
			});
		} else if (devices.insteon[id].type === "fan") {
			device.fan().then(function (speed) {
				return callback(null, speed == "off" ? "off" : "on");
			});
		}

	} else {
		dispatch.devices(function (err, d) {
			if (d.hasOwnProperty(id)) {
				return callback(err, d[id].status);
			} else {
				console.log(err);
				return callback(err, "off");
			}
		});
	}

}

function setStatusOfDevice(id, status, callback) {
	if (isValidDeviceId(id) === false) {
		return callback("Invalid Device");
	}
	var device = hub.light(id.substring(0, 6));
	if (status == "on") {
		pool.add(function () {
			if (devices.insteon[id].type == "switch") {
				hub.light(id).turnOn().then(function () {
					dispatch.setStatus(id, status);
					callback();
				});
			} else { //fan
				hub.light(id.substring(0, 6)).fanOn().then(function () {
					dispatch.setStatus(id, status);
					callback();
				});
			}
		});
	} else if (status == "off") {
		pool.add(function () {
			if (devices.insteon[id].type == "switch") {
				hub.light(id).turnOff().then(function () {
					dispatch.setStatus(id, status);
					callback();
				});
			} else { //fan
				hub.light(id.substring(0, 6)).fanOff().then(function () {
					dispatch.setStatus(id, status);
					callback();
				});
			}
		});
	} else if (status == "toggle") {
		if (devices.insteon[id].type == "switch") {
			getStatusOfDevice(id, function (err, status) {
				if (status == "on") {
					pool.add(function () {
						device.turnOff()
							.then(function (status) {
								dispatch.setStatus(id, "off");
								callback();
							});
					});
				} else {
					pool.add(function () {
						device.turnOn()
							.then(function (status) {
								dispatch.setStatus(id, "on");
								callback();
							});
					});
				}
			});
		} else { //fan
			getStatusOfDevice(id, function (err, status) {
				if (status == "on") {
					pool.add(function () {
						device.fanOff()
							.then(function (status) {
								dispatch.setStatus(id, "off");
								callback();
							});
					});
				} else {
					pool.add(function () {
						device.fanOn()
							.then(function (status) {
								dispatch.setStatus(id, "on");
								callback();
							});
					});
				}
			});
		}

	}

}

function dim(id, level, callback) {
	if (isValidDeviceId(id) === false) {
		return callback("Invalid Device");
	}

	var device = hub.light(id.substring(0, 6));

	pool.add(function () {
		if (devices.insteon[id].type == "switch") {
			hub.light(id).level(level).then(function () {
				callback(null);
			});
		} else {
			callback(null);
		}
	});

}

function isValidDeviceId(id) {
	if (devices.insteon.hasOwnProperty(id) === false) {
		return false;
	}
	var device = devices.insteon[id];
	if (!(device.type === "switch" || device.type === "fan")) {
		return false;
	}
	if (device.enabled === false) {
		return false;
	}
	return true;
}