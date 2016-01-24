var Insteon = require('home-controller').Insteon;
var async = require('async');
var util = require('util');
var moment = require('moment');
var devices = require("../config/devices.json");
var motion = require("../lib/motion");
var keypad = require("../lib/keypad");
var pool = require("../lib/pool");

var hub = new Insteon();

module.exports.register = register;
module.exports.setStatusOfDevice = setStatusOfDevice;
module.exports.listDevices = listDevices;

function register(callback) {

	var motionDevices = getInsteonDevicesByType("motion");
	motionDevices.forEach(function(id) {
		var device = hub.motion(id);
		device.on('motion', function() {

			var d = devices.insteon[id];
			console.log(
				util.format(
					"%s motion detected at %s",
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
	return callback(null, devices.insteon);
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

function setStatusOfDevice(id, status, callback) {
	if (devices.insteon.hasOwnProperty(id) == false) {
		return callback("no device found");
	}

	var device = devices.insteon[id];
	if (device.type != "switch") {
		console.log("skipping non switch device: " + id);
		return callback(null);
	}
	if (device.enabled == false) {
		console.log("skipping disabled device: " + id);
		return callback(null);
	}



	if (status == "on") {
		pool.add(function() {
			hub.light(id).turnOn().then(function() {
				callback(null);
			});
		});
	} else if (status == "off") {
		pool.add(function() {
			hub.light(id).turnOff().then(function() {
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
							callback(null);
						});
				});
			} else { //is off
				pool.add(function() {
					device.turnOn()
						.then(function(status) {
							callback(null);
						});
				});
			}
		});
	}
}