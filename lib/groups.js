var async = require("async");
var devices = require("../devices/");
var insteon = require("../api/insteon");
var harmony = require("../api/harmony");
var lifx = require("../api/lifx");

module.exports.setStatus = setStatus;
module.exports.list = list;

function list(callback) {
	return callback(null, devices.groups);
}

function setStatus(group, status, callback) {
	var allDevices = [];

	if (devices.groups.hasOwnProperty(group) === false) {
		return callback("group does not exist");
	}

	var commands = devices.groups[group][status];
	async.eachSeries(commands, function(item, nextCommand) {
		//console.log("Running: " + item.description);
		if (item.type == "insteon") {
			insteon.setStatusOfDevice(item.id, status, function(err) {
				return nextCommand(err);
			});
		}
		if (item.type == "lifx") {
			lifx.setStatusOfDevice(item.id, status, function(err) {
				return nextCommand(err);
			});
		}
		if (item.type == "harmony") {
			if (item.hasOwnProperty("activity")) {
				harmony.runActivity(item.id, item.activity, function(err) {
					return nextCommand(err);
				});
			}
			if (item.hasOwnProperty("command")) {
				harmony.runCommand(item.id, item.device, item.command, function(err) {
					return nextCommand(err);
				});
			}
		}
	}, function(err) {
		//console.log("group completed");
		return callback(err); 
	});
}