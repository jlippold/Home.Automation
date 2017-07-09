var async = require("async");
var devices = require("../config/devices.json");
var insteon = require("../api/insteon");
var harmony = require("../api/harmony");
var lifx = require("../api/lifx");

module.exports.runSequence = runSequence;
module.exports.list = list;

function list(callback) {
	return callback(null, devices.sequence);
}

function runSequence(sequence, callback) {
	var allDevices = [];

	if (devices.sequence.hasOwnProperty(sequence) === false) {
		return callback("sequence does not exist");
	}

	var commands = devices.sequence[sequence].commands;
	async.eachSeries(commands, function(item, nextCommand) {
		console.log("Running: ", item);
		if (item.type == "insteon") {
			insteon.setStatusOfDevice(item.id, item.status, function(err) {
				return nextCommand(err);
			});
		}
		if (item.type == "lifx") {
			lifx.setStatusOfDevice(item.id, item.status, function(err) {
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
		console.log("group completed");
		return callback(err); 
	});
}