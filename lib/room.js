
var devices = require("./config/devices.json");

module.exports.setStatusForRoom = setStatusForRoom;

function setStatusForRoom(room, status, callback) {
	var allDevices = [];

	Object.keys(devices.insteon).forEach(function(id) {
		var device = devices.insteon[id];
		device.id = id;
		device.type = "insteon";
		if (device.location == room && device.type != "motion") {
			allDevices.push(device);
		}
	});

	Object.keys(devices.custom).forEach(function(id) {
		var device = devices.custom[id];
		device.id = id;
		device.type = "custom";
		if (device.location == room) {
			allDevices.push(device);
		}
	});


	async.forEachOf(allDevices, function(device, idx, next) {

		if (device.type == "insteon") {
			setStatusOfInsteonDevice(device.id, status, function(err) {
				next(err);
			});
		} else {
			setStatusOfCustomDevice(device.id, status, function(err) {
				next(err);
			});
		}

	}, function(err) {
		if (err) console.error(err.message);
		callback();
	});
}
