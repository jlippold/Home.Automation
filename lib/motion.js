var devices = require("../config/devices.json");
var insteon = require("../api/insteon");
var request = require('request');
var util = require('util');
var moment = require('moment');

var timeOuts = {
	kodi: {
		lastEvent: false,
		cutoff: 15
	},
	toggle: {
		isOn: false,
		cutoff: 300,
		onTimeout: null
	}
};



module.exports.fired = fired;
module.exports.testFire = testFire;

function testFire(id, callback) {
	if (devices.insteon.hasOwnProperty(id) == false) {
		return callback("no device found");
	}
	fired(devices.insteon[id]);
	callback();
}

function fired(device) {

	if (!device.hasOwnProperty("action")) {
		return;
	}

	if (!device.action.hasOwnProperty("type")) {
		return;
	}

	if (device.action.type == "kodi") {
		return displayOnKodi(device);
	}

	if (device.action.type == "toggle") {
		return triggerEvent(device);
	}

}

function displayOnKodi(device) {

	var servers = Object.keys(devices.kodi).map(function(server) {
		return devices.kodi[server].ip;
	});

	var jsonrpc = '{"jsonrpc":"2.0","id":1,"method":"Addons.ExecuteAddon","params":{"addonid":"script.securitycam_%s"}}';
	jsonrpc = util.format(jsonrpc, device.action.camera);

	var shouldNotify = true;
	if (timeOuts.kodi.lastEvent) {
		shouldNotify = moment().isAfter(timeOuts.kodi.lastEvent); //now > timeout
	}

	if (shouldNotify) {
		timeOuts.kodi.lastEvent = moment().add(timeOuts.kodi.cutoff, 'seconds');
		servers.forEach(function(server) {
			request.get(util.format("http://%s/jsonrpc?request=%s", server, jsonrpc));
		});
	}

}

function triggerEvent(device) {

	if (!timeOuts.toggle.isOn) {
		insteon.setStatusOfDevice(device.action.insteon, "on", function(err) {
			if (!err) {
				timeOuts.toggle.isOn = true;
			}
		});
	}

	if (timeOuts.toggle.onTimeout) {
		clearTimeout(timeOuts.toggle.onTimeout);
	}

	timeOuts.toggle.onTimeout = setTimeout(function() {
		insteon.setStatusOfDevice(device.action.insteon, "off", function(err) {
			if (!err) {
				timeOuts.toggle.isOn = false;
			}
		});
	}, timeOuts.toggle.cutoff * 1000);

}