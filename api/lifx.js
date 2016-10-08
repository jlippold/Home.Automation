var async = require('async');
var nodeUtil = require('util');
var devices = require("../config/devices.json").lifx;
var dispatch = require("../lib/dispatch");
var lifxObj = require('lifx-api');
var lifx;

var client;

module.exports.init = init;
module.exports.setStatusOfDevice = setStatusOfDevice;
module.exports.getStatusOfDevice = getStatusOfDevice;
module.exports.listDevices = listDevices;

function init(callback) {
	lifx = new lifxObj(process.env.LIFX_Api_Key || "");
	getLightStatus("all", function(err, lights) {
		console.log(lights.length + " lifx devices found");
		callback(err);
	});
}

function getLightStatus(selector, callback) {
	lifx.listLights(selector, function(err, lights) {
		if (err) {
			console.error(err);
			return callback(err);
		}

		lights.forEach(function(light) {
			var id = light.id;
			devices[id].online = light.connected;
			//devices[id].ipaddress = light.address;
			var status = light.power == "on" ? "on" : "off";
			dispatch.setStatus(id, status);
		});
		callback(err, lights);
	});
}

function listDevices(callback) {
	var list = {};
	Object.keys(devices).forEach(function(id) {
		var device = devices[id];
		device.onUrl = "lifx/" + id + "/on";
		device.offUrl = "lifx/" + id + "/off";
		device.toggle = "lifx/" + id + "/toggle";
		device.status = "unknown";
		list[id] = device;
	});
	return callback(null, list);
}


function getStatusOfDevice(id, callback) {
	if (isValidDeviceId(id) === false) {
		return callback("Invalid Device");
	}
	getLightStatus("id:" + id, function(err, lights) {
		if (err) {
			return callback(err);
		}
		var device = devices[id];
		if (!device.online) {
			return callback("Offline Device");
		}
		return callback(null, device.status);
	});
}

function setStatusOfDevice(id, status, callback) {
	if (isValidDeviceId(id) === false) {
		return callback("Invalid Device");
	}

	if (status == "on" || status == "off") {
		lifx.setPower("id:" + id, status, 0.5, function(err, body) {

			if (err) {
				dispatch.setStatus(id, "unknown");
			} else {
				dispatch.setStatus(id, status);
			}

			return callback(err);

		});
	} else if (status == "toggle") {
		lifx.togglePower("id:" + id, function(err, body) {
			if (err) {
				dispatch.setStatus(id, "unknown");
			} else {
				setTimeout(function() {
					getStatusOfDevice(id, function() {});
				}, 1000);
			}
			return callback(err);
		});
	} else {
		return callback("Bad status recieved");
	}
}

function isValidDeviceId(id) {
	if (devices.hasOwnProperty(id) === false) {
		return false;
	}
	var device = devices[id];

	if (device.enabled === false) {
		return false;
	}

	return true;
}