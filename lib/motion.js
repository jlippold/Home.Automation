var devices = require("../devices/");
var insteon = require("../api/insteon");
var lifx = require("../api/lifx");
var camAPI = require("../api/cams");
var mobile = require("../api/mobile");
var dispatch = require("./dispatch");
var request = require('request');
var util = require('util');
var moment = require('moment');
var async = require('async');
var SunCalc = require('suncalc');
var latitude = process.env.latitude || 38.8977;
var longitude = process.env.longitude || -77.0366;
var snoozeTimeout = { onTimeout: null, expiry: null};
var isSnoozed = false;

var timeOuts = {
	kodi: {
		lastEvent: false
	},
	toggles: {}
};

module.exports.fired = fired;
module.exports.testFire = testFire;
module.exports.snooze = snooze;
module.exports.snoozeEnabled = snoozeEnabled;

function snoozeEnabled(callback) {
	callback(null, { snooze: isSnoozed, expiry: snoozeTimeout.expiry });
}

function snooze(minutes, callback) {
	if (minutes == "off") {
		isSnoozed = false;
		snoozeTimeout.expiry = null;
		return callback(null, { status: "ok" });
	}

	isSnoozed = true;
	
	snoozeTimeout.onTimeout = setTimeout(function () {
		isSnoozed = false;
		snoozeTimeout.expiry = null;
	}, minutes * 60 * 1000);
	snoozeTimeout.expiry = moment().add(minutes, "minutes");
	callback(null, { status: "ok" });
}

function testFire(id, callback) {
	if (devices.insteon.hasOwnProperty(id) === false) {
		return callback("no device found for test fire " + id);
	}
	fired(devices.insteon[id]);
	callback();
}

function fired(device) {

	if (!device.hasOwnProperty("actions")) {
		return;
	}

	device.actions.forEach(function (action) {

		if (action.type == "push" && isSnoozed == false) {

			var cam = camAPI.cameras.find(function (c) {
				return c.name == action.camera;
			});

			if (!cam) {
				console.error("can't find cam for push");
			} else {

				dispatch.motion(cam.name);

				var night = isNightTime();
				camAPI.createMP4(cam, night, function (err, image) {
					if (err) return console.error(err);
					mobile.sendPushNotification(image, action.camera, function (err) {

					});
				});
			}

		}
		if (action.type == "kodi" && isSnoozed == false) {
			displayOnKodi(device, action);
		}

		if (action.type == "alexa" && isSnoozed == false) {
			notifyAlexa(action.text);
		}

		if (action.type == "toggle") {
			setTimeout(function () {
				triggerEvent(device, action);
			}, 250);
		}
	});
}

function notifyAlexa(text) {
	var night = isNightTime();
	//if (night) return;

	var options = {
		url: 'http://192.168.1.110:8123/api/services/notify/alexa_media',
		method: "POST",
		headers: {
			'Authorization': 'Bearer ' + process.env.homeAssistant,
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		json: { 
			"message": text, 
			"data": { "type": "announce", "method": "all" }, 
			"target": ["media_player.office", "media_player.kitchen"] 
		}
	};
	request(options, function(){});
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

		if (server != "cora") {
			var url = util.format("http://%s/jsonrpc", server);
			var options = {
				uri: url, 
				method: 'POST',
				body: jsonrpc,
				auth: {user, pass}
			}
			request(options, function (err, response, body) {
				if (err) {
					console.error(err);
				}
				//console.error(body);
			});
		}
	});

}

function isNightTime() {
	var now = moment();
	var astro = SunCalc.getTimes(now, latitude, longitude);
	return now.isSameOrAfter(moment(astro.sunset)) || now.isSameOrBefore(moment(astro.sunrise));
}

function triggerEvent(device, action) {

	if (action.hasOwnProperty("nightOnly") && action.nightOnly == true) {
		if (!isNightTime()) {
			return;// console.log("Skipping nighttime only event");
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
	if (action.hasOwnProperty("cutoff")) {
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

}