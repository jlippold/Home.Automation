var Insteon = require('home-controller').Insteon;
var async = require('async');
var nodeUtil = require('util');
var util = require("../lib/util");
var moment = require('moment');
var devices = require("../config/devices.json");
var motion = require("../lib/motion");
var keypad = require("../lib/keypad");
var pool = require("../lib/pool");
var dispatch = require("../lib/dispatch");

var hub = new Insteon();

module.exports.register = register;
module.exports.setStatusOfDevice = setStatusOfDevice;
module.exports.getStatusOfDevice = getStatusOfDevice;
module.exports.listDevices = listDevices;


function register(callback) {

	var motionDevices = getInsteonDevicesByType("motion");
	motionDevices.forEach(function(id) {
		var device = hub.motion(id);
		device.on('motion', function() {

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
	doors.forEach(function(id) {
		var device = hub.door(id);
		device.on('opened', function() {
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
	keypads.forEach(function(id) {
		var toggle = hub.light(id);

		function registerButtonPress(digit) {
			var d = devices.insteon[id];
			keypad.pressed(d, digit);
		}
		toggle.on('turnOn', registerButtonPress);
		toggle.on('turnOff', registerButtonPress);
	});


	hub.connect(devices.hub.ip, function() {
		callback();
	});
}

function listDevices(callback) {
	var list = {};
	Object.keys(devices.insteon).forEach(function(id) {

		var device = devices.insteon[id];

		if (device.type == "switch") {
			device.onUrl = util.getHost() + "/insteon/" + id + "/on";
			device.offUrl = util.getHost() + "/insteon/" + id + "/off";
			device.toggle = util.getHost() + "/insteon/" + id + "/toggle";
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
	Object.keys(devices.insteon).forEach(function(id) {
		if (devices.insteon[id].type == type) {
			arr.push(id);
		}
	});
	return arr;
}

function getStatusOfDevice(id, callback) {
	if (isValidDeviceId(id) === false) {
		return callback("Invalid Device");
	}
	var device = hub.light(id);
	device.level(function(err, level) {
		if (level > 0) { //is on 
			return callback(err, "on");
		} else { //is off
			return callback(err, "off");
		}
	});
}

function setStatusOfDevice(id, status, callback) {
	if (isValidDeviceId(id) === false) {
		return callback("Invalid Device");
	}

	if (status == "on") {
		pool.add(function() {
			hub.light(id).turnOn().then(function() {
				dispatch.setStatus(id, status);
				callback(null);
			});
		});
	} else if (status == "off") {
		pool.add(function() {
			hub.light(id).turnOff().then(function() {
				dispatch.setStatus(id, status);
				callback(null);
			});
		});
	} else if (status == "toggle") {
		var device = hub.light(id);
		device.level(function(err, level) {
			if (level > 0) { //is on
				pool.add(function() {
					device.turnOff()
						.then(function(status) {
							dispatch.setStatus(id, "off");
							callback(null);
						});
				});
			} else { //is off
				pool.add(function() {
					device.turnOn()
						.then(function(status) {
							dispatch.setStatus(id, "on");
							callback(null);
						});
				});
			}
		});
	}

}

function isValidDeviceId(id) {
	if (devices.insteon.hasOwnProperty(id) === false) {
		return false;
	}
	var device = devices.insteon[id];
	if (device.type != "switch") {
		return false;
	}
	if (device.enabled === false) {
		return false;
	}
	return true;
}