var HarmonyHub = require('harmonyhubjs-client');
var async = require('async');
var fs = require('fs');
var devices = require("../config/devices.json");

module.exports.init = init;
module.exports.listHubs = listHubs;
module.exports.listRoomCommands = listRoomCommands;
module.exports.runActivity = runActivity;
module.exports.toggleActivity = toggleActivity;
module.exports.runCommand = runCommand;

var hubs = {};

function init(callback) {

	async.each(Object.keys(devices.harmony), function(key, nextHub) {
		var address = devices.harmony[key].ip;
		HarmonyHub(address).then(function(hub) {
			async.parallel({
				activities: function(complete) {

					hub.getActivities().then(function(json) {

						var activities = {}

						json.forEach(function(item) {
							activities[item.id] = {
								id: item.id,
								name: item.label
							};
						});

						if (hubs.hasOwnProperty(address) == false) {
							hubs[address] = {};
						}

						hubs[address].activities = activities;

						complete();
					});

				},
				commands: function(complete) {
					hub.getAvailableCommands().then(function(json) {

						if (hubs.hasOwnProperty(address) == false) {
							hubs[address] = {};
						}

						hubs[address].devices = [];

						json.device.forEach(function(device) {

							device.commands = {};
							device.controlGroup.forEach(function(group) {
								var category = group.name;
								group["function"].forEach(function(command) {
									command.category = group.name;
									device.commands[command.name] = command;
								});
							});

							Object.keys(device).forEach(function(key) {
								if (["label", "id", "model", "manufacturer", "commands"].indexOf(key) == -1) {
									delete device[key];
								}
							});
							hubs[address].devices.push(device);
						});

						hubs[address].devices = json.device;
						complete();
					});
				}
			}, function(err, results) {
				nextHub();
			});
		});
	}, function(err) {
		saveConfig();
		callback();
	});

}

function listRoomCommands(hub, callback) {
	if (devices.harmony.hasOwnProperty(hub)) {
		var address = devices.harmony[hub].ip;
		return callback(null, hubs[address]);
	} else {
		return callback("hub does not exist");
	}
}

function listHubs(callback) {
	callback(Object.keys(devices.harmony));
}

function saveConfig() {
	var content = JSON.stringify(hubs, null, 4);

	fs.writeFile(__dirname + "/../volatile/harmony.json", content, function(err) {
		if (err) {
			return console.log(err);
		}
	});
}

function runActivity(hubName, activity, callback) {
	if (devices.harmony.hasOwnProperty(hubName) == false) {
		return callback("hub does not exist");
	}
	var address = devices.harmony[hubName].ip;
	if (hubs[address].activities.hasOwnProperty(activity) == false) {
		return callback("activity does not exist");
	}

	HarmonyHub(address).then(function(hub) {
		hub.startActivity(activity);
		hub.end();
		setTimeout(function() {
			runSupplementals(hubName, activity, function(err) {
				return callback();
			});
		}, 5000);
	});
}

function toggleActivity(hubName, activity, callback) {

	if (devices.harmony.hasOwnProperty(hubName) == false) {
		return callback("hub does not exist");
	}
	var address = devices.harmony[hubName].ip;
	if (hubs[address].activities.hasOwnProperty(activity) == false) {
		return callback("activity does not exist");
	}

	HarmonyHub(address).then(function(hub) {
		hub.isOff().then(function(off) {
			hub.end();
			if (off) {
				console.log("Turning on TV");
			} else {
				console.log("Turning off TV");
				activity = "-1";
			}

			runActivity(hubName, activity, function() {
				callback()
			});
		});
	});

}

function runSupplementals(hubName, activity, callback) {
	var activityConfig = devices.harmony[hubName].activities[activity];
	if (activityConfig.hasOwnProperty("supplementalCommands")) {
		async.eachSeries(activityConfig.supplementalCommands, function(item, next) {
			runCommand(hubName, item.device, item.command, function() {
				console.log(item);
				setTimeout(function() {
					return next();
				}, 1000);
			});
		}, function(err) {
			return callback(err);
		});
	} else {
		return callback();
	}
}

function runCommand(hub, device, command, callback) {
	if (devices.harmony.hasOwnProperty(hub) == false) {
		return callback("hub does not exist");
	}
	var address = devices.harmony[hub].ip;
	var foundDevice;

	hubs[address].devices.forEach(function(d) {
		if (d.id == device) {
			foundDevice = d;
		}
	});

	if (!foundDevice) {
		return callback("device does not exist");
	}

	if (foundDevice.commands.hasOwnProperty(command) == false) {
		return callback("command does not exist");
	}

	HarmonyHub(address).then(function(hub) {
		var encodedAction = foundDevice.commands[command].action.replace(/\:/g, '::');
		hub.send('holdAction', 'action=' + encodedAction + ':status=press')
		hub.end();
		callback();
	});
}