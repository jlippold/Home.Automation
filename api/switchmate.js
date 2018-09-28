var async = require('async');
var nodeUtil = require('util');
var request = require('request');
var devices = require("../devices/").switchmate;
var dispatch = require("../lib/dispatch");

module.exports.setStatusOfDevice = setStatusOfDevice;
module.exports.listDevices = listDevices;

function listDevices(callback) {
	var list = {};
	Object.keys(devices).forEach(function(id) {
		var device = devices[id];
		device.onUrl = "switchmate/" + id + "/on";
		device.offUrl = "switchmate/" + id + "/off";
		device.status = "unknown";
		list[id] = device;
	});
	return callback(null, list);
}

function setStatusOfDevice(id, status, callback) {
	if (isValidDeviceId(id) === false) {
		return callback("Invalid Device");
	}
	
	if (status == "on" || status == "off") {
		var url = (status == "on" ? devices[id].toggle.onUrl : devices[id].toggle.offUrl);
        request.get(url, function(err) {
			return callback();
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