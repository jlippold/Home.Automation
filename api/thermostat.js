var request = require('request');
var util = require('../lib/util');
var dispatch = require("../lib/dispatch");
var devices = require("../config/devices.json");

module.exports.setStatusOfDevice = setStatusOfDevice;
module.exports.getStatusOfDevice = getStatusOfDevice;
module.exports.list = listDevices;

function setStatusOfDevice(mode, status, callback) {

	if (devices.thermostat.hasOwnProperty(mode) === false) {
		return callback("thermostat mode does not exist");
	}

	var thermostat = devices.thermostat[mode];
	var id = mode;

	if (status == "on" || status == "off") {

		setStatus(id, status, function(err, thermostat) {
			callback(err);
		});

	} else if (status == "toggle") {
		getStatusOfDevice(id, function(err, actualStatus, thermostat) {
			if (actualStatus == "off") { //turn on
				setStatus(id, "on", function(err, thermostat) {
					callback(err);
				});
			} else {
				setStatus(id, "off", function(err, thermostat) {
					callback(err);
				});
			}
		});
	}

}

function getStatusOfDevice(mode, callback) {

	if (devices.thermostat.hasOwnProperty(mode) === false) {
		return callback("thermostat mode does not exist");
	}

	var device = devices.thermostat[mode];

	getStatus(device, function(err, thermostat) {
		if (thermostat && thermostat.hasOwnProperty("current")) {
			if (mode == thermostat.current.mode) {
				callback(err, "on", thermostat);
			} else {
				callback(err, "off", thermostat);
			}
		} else {
			device.current = {};
			callback(err, "off", device);
		}
	});

}

function listDevices(callback) {
	var list = {};
	Object.keys(devices.thermostat).forEach(function(id) {

		var device = devices.thermostat[id];

		device.onUrl = util.getHost() + "/thermostat/" + id + "/on";
		device.offUrl = util.getHost() + "/thermostat/" + id + "/off";
		device.toggle = util.getHost() + "/thermostat/" + id + "/toggle";
		device.status = "unknown";

		list[id] = device;
	});
	return callback(null, list);
}

function getStatus(thermostat, callback) {
	request(thermostat.address, function(error, response, body) {
		if (error) {
			return callback(error);
		}

		parseJSON(body, function(err, result) {
			if (!err) {
				thermostat.current = result;
			}
			return callback(err, thermostat);
		});
	});
}

function setStatus(id, status, callback) {

	dispatch.setStatus(id, status);
	var thermostat = devices.thermostat[id];

	request(thermostat.address + "?" + thermostat[status], function(error, response, body) {
		if (error) {
			return callback(error);
		}
		parseJSON(body, function(err, result) {
			if (!err) {
				thermostat.current = result;
			}
			return callback(err, thermostat);
		});

	});
}

function parseJSON(body, callback) {

	var result;

	try {
		result = JSON.parse(body);
	} catch (e) {
		return callback(e);
	}

	var device = result.thermostatList[0];

	return callback(null, {
		mode: device.settings.hvacMode, //"off", "heat", "cool"
		temperature: (device.runtime.actualTemperature / 10),
		low: (device.runtime.desiredCool / 10),
		high: (device.runtime.desiredHeat / 10)
	});
}