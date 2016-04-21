var async = require('async');
var nodeUtil = require('util');
var devices = require("../config/devices.json").lifx;
var dispatch = require("../lib/dispatch");
var LifxClient = require('node-lifx').Client;

var client;

module.exports.init = init;
module.exports.setStatusOfDevice = setStatusOfDevice;
module.exports.getStatusOfDevice = getStatusOfDevice;
module.exports.listDevices = listDevices;

function init(callback) {

	client = new LifxClient();

	client.init({
		lightOfflineTolerance: 2,
		messageHandlerTimeout: 15000
	});

	client.on('light-new', function(light) {
		var id = light.id;
		console.log("DISCOVERED: " + id);
		if (devices.hasOwnProperty(id)) {
			devices[id].online = true;
			devices[id].ipaddress = light.address;
			var status = light.status == "off" ? "off" : "on";
			dispatch.setStatus(id, status);
		}
	});

	client.on('light-offline', function(light) {
		var id = light.id;
		console.log("OFFLINE: " + id);
		if (devices.hasOwnProperty(id)) {
			devices[id].online = false;
			dispatch.setStatus(id, "offline");
		}

	});
	client.on('light-online', function(light) {
		var id = light.id;
		console.log("ONLINE: " + id);
		if (devices.hasOwnProperty(id)) {
			devices[id].online = true;
			devices[id].ipaddress = light.address;
			var status = light.status == "off" ? "off" : "on";
			dispatch.setStatus(id, status);
		}
	});

	callback();
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
	var device = client.light(id);

	device.getPower(function(err, isOn) {

		if (err) {
			console.error(err);
			dispatch.setStatus(id, "unknown");
			return callback(err, "off");
		}

		if (isOn == 1) { //is on 
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

	var device = client.light(id);

	if (status == "on") {

		client.light(id).on(500, function(err) {
			if (err) {
				console.error(err);
				dispatch.setStatus(id, "unknown");
			} else {
				dispatch.setStatus(id, status);
			}
			callback(null);
		});

	} else if (status == "off") {

		client.light(id).off(500, function(err) {
			if (err) {
				console.error(err);
				dispatch.setStatus(id, "unknown");
			} else {
				dispatch.setStatus(id, status);
			}
			callback(null);
		});

	} else if (status == "toggle") {
		getStatusOfDevice(id, function(err, status) {
			status = (status == "on" ? "off" : "on");
			client.light(id)[status](500, function(err) {
				if (err) {
					console.error(err);
					dispatch.setStatus(id, "unknown");
				} else {
					dispatch.setStatus(id, status);
				}
				callback(null);
			});
		});
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

	if (device.online === false) {
		return false;
	}
	return true;
}