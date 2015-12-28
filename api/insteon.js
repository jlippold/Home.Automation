var Insteon = require('home-controller').Insteon;
var async = require('async');
var util = require('util');
var kodi = require('./kodi');
var devices = require("../config/devices.json");

var hub = new Insteon();

module.exports.register = register;
module.exports.setStatusOfDevice = setStatusOfDevice;

function register(callback) {

	var motionDevices = getInsteonDevicesByType("motion");
	motionDevices.forEach(function(id) {
		var device = hub.motion(id);
		device.on('motion', function() {
			console.log(util.format("%s motion detected at %s",
				devices.insteon[id].location,
				new Date()));
			kodi.notify();
		});
	});

	hub.connect(devices.hub.ip, function() {
		console.log("connected to insteon hub " + devices.hub.ip);
		callback();
	});
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
	if (device.type == "motion") {
		console.log("skipping motion device: " + id);
		return callback(null);
	}
	if (device.enabled == false) {
		console.log("skipping disabled device: " + id);
		return callback(null);
	}

	if (status == "on") {
		hub.light(id).turnOn()
			.then(function(status) {
				callback(null);
			});
	} else {
		hub.light(id).turnOff()
			.then(function(status) {
				callback(null);
			});
	}
}