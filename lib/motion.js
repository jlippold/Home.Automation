var devices = require("../config/devices.json");
var insteon = require("../api/insteon");
var lifx = require("../api/lifx");
var request = require('request');
var util = require('util');
var moment = require('moment');
var async = require('async');
var SunCalc = require('suncalc');
var latitude = process.env.latitude || 38.8977;
var longitude = process.env.longitude || -77.0366;

var timeOuts = {
	kodi: {
		lastEvent: false
	},
	toggles: {}
};

module.exports.fired = fired;
module.exports.testFire = testFire;

function testFire(id, callback) {
	if (devices.insteon.hasOwnProperty(id) === false) {
		return callback("no device found");
	}
	fired(devices.insteon[id]);
	callback();
}

function fired(device) {

	if (!device.hasOwnProperty("actions")) {
		return;
	}

	device.actions.forEach(function (action) {

		if (action.type == "kodi") {
			displayOnKodi(device, action);
		}

		if (action.type == "toggle") {
			setTimeout(function () {
				triggerEvent(device, action);
			}, 250);
		}
	});
}

function displayOnKodi(device, action) {

	var servers = Object.keys(devices.kodi).map(function (server) {
		return devices.kodi[server].ip;
	});

	var jsonrpc;
	if (action.hasOwnProperty("addon")) {
		jsonrpc = '{"jsonrpc":"2.0","id":1,"method":"Addons.ExecuteAddon","params":{"addonid":"%s"}}';
		jsonrpc = util.format(jsonrpc, action.addon);
	} else { //camera
		jsonrpc = '{"jsonrpc":"2.0","method":"Addons.ExecuteAddon","params":{"addonid":"script.securitycam_dispatch","params": { "camera": "%s"} }, "id": 2 }';
		jsonrpc = util.format(jsonrpc, action.camera);
	}

	if (action.hasOwnProperty("addon")) {
		console.log("Running kodi addon " + action.addon);
	} else {
		console.log("Showing kodi camera " + action.camera);
	}

	var user = process.env.KODI_USER || "user";
	var pass = process.env.KODI_PASS || "pass";

	servers.forEach(function (server) {
		request.get(util.format("http://%s:%s@%s/jsonrpc?request=%s", user, pass, server, jsonrpc));
	});

}

function triggerEvent(device, action) {

	if (action.hasOwnProperty("nightOnly") && action.nightOnly == true) {
		var now = moment();
		var astro = SunCalc.getTimes(now, latitude, longitude);
		var night = now.isSameOrAfter(moment(astro.sunset)) || now.isSameOrBefore(moment(astro.sunrise));
		if (!night) {
			return console.log("Skipping nighttime only event");
		}
	}

	var id = action.hasOwnProperty("insteon") ? action.insteon : action.lifx;
	if (!timeOuts.toggles.hasOwnProperty(id)) {

		timeOuts.toggles[id] = {
			isOn: false,
			onTimeout: null
		};

		console.log("Turning on device from motion: " + id);

		if (action.hasOwnProperty("insteon")) {
			var id = action.insteon;
			insteon.setStatusOfDevice(action.insteon, "on", function (err) {
				if (!err) {
					timeOuts.toggles[id].isOn = true;
				}
			});
		}

		if (action.hasOwnProperty("lifx")) {
			lifx.setStatusOfDevice(action.lifx, "on", function (err) {
				if (!err) {
					timeOuts.toggles[id].isOn = true;
				}
			});
		}
	}


	if (timeOuts.toggles[id].onTimeout) {
		clearTimeout(timeOuts.toggles[id].onTimeout);
	}

	timeOuts.toggles[id].onTimeout = setTimeout(function () {
		console.log("Turning off device from motion timeout: " + id);
		if (action.hasOwnProperty("insteon")) {
			insteon.setStatusOfDevice(action.insteon, "off", function (err) {
				if (!err) {
					delete timeOuts.toggles[id];
				}
			});
		}
		if (action.hasOwnProperty("lifx")) {
			lifx.setStatusOfDevice(action.lifx, "off", function (err) {
				if (!err) {
					delete timeOuts.toggles[id];
				}
			});
		}
	}, action.cutoff * 1000);

}