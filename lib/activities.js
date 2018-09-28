var async = require("async");
var request = require("request");
var api = require("../api/");
var lib = require("../lib/");
var groups = require("../devices/").groups;
var kodis = require("../devices/").kodi

module.exports.status = status;
module.exports.alexa = alexa;

var prefix = "http://192.168.1.110:3000/";
var haBridgeUrl = "http://192.168.1.110:8080/api/devices";

function status(callback) {
	lib.dispatch.devices(function(err, devices) {
		callback(err, devices);
	});
}

function alexa(action, callback) {
	lib.dispatch.devices(function(err, devices) {
		var d = [];
		Object.keys(devices).forEach(function(key) {
			if (devices[key].hasOwnProperty("alexaNames")) {
				devices[key].alexaNames.forEach(function(name) {
					d.push({
						name: name,
						deviceType: "switch",
						offUrl: prefix + devices[key].offUrl,
						onUrl: prefix + devices[key].onUrl
					});
				});
			}
		});

		Object.keys(groups).forEach(function(key) {
			if (groups[key].hasOwnProperty("alexaNames")) {
				groups[key].alexaNames.forEach(function(name) {
					d.push({
						name: name,
						deviceType: "switch",
						offUrl: prefix + "groups/" + key + "/off",
						onUrl: prefix + "groups/" + key + "/on"
					});
				});
			}
		});

		Object.keys(kodis).forEach(function(key) {
			if (kodis[key].hasOwnProperty("alexaNames")) {
				kodis[key].alexaNames.forEach(function(name) {
					d.push({
						name: name,
						deviceType: "switch",
						offUrl: prefix + "televisions/" + key + "/commands/powerToggle",
						onUrl: prefix + "televisions/" + key + "/commands/powerToggle"
					});
				});
			}

			d.push({
				name: kodis[key].name + " cnn",
				deviceType: "switch",
				offUrl: prefix,
				onUrl: prefix + `televisions/${key}/channel/CNNHD`
			});
			d.push({
				name: kodis[key].name + " disney",
				deviceType: "switch",
				offUrl: prefix,
				onUrl: prefix + `televisions/${key}/channel/DISNHD`
			});
			d.push({
				name: kodis[key].name + " nick",
				deviceType: "switch",
				offUrl: prefix,
				onUrl: prefix + `televisions/${key}/channel/NICJRHD`
			});
			d.push({
				name: kodis[key].name + " VH1",
				deviceType: "switch",
				offUrl: prefix,
				onUrl: prefix + `televisions/${key}/channel/VH1HD`
			});
			d.push({
				name: kodis[key].name + " cartoon network",
				deviceType: "switch",
				offUrl: prefix,
				onUrl: prefix + `televisions/${key}/channel/TOONHD`
			});
		
		});

		if (action !== "configure") {
			return callback(null, d);
		}

		async.eachLimit(d, 2, function(device, next) {
			request.post({uri: haBridgeUrl, json: device}, function(err, r) {
				next(err);
			});
		}, function(err) {
			callback(err, d);
		});
		
	});
}