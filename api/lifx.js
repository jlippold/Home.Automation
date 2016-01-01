var request = require('request');
var util = require('util');
var devices = require("../config/devices.json");

module.exports.setStatus = setStatus;

function setStatus(id, status, callback) {

	if (devices.lifx.hasOwnProperty(id) == false) {
		return callback("lifx device does not exist");
	}

	if (process.env.hasOwnProperty("IFTTT_MAKER_TOKEN")) {

		var makerKey = process.env.IFTTT_MAKER_TOKEN;
		var makerEvent = devices.lifx[id].ifttt_maker[status];
		var url = util.format("https://maker.ifttt.com/trigger/%s/with/key/%s", makerEvent, makerKey);

		request.post(url, function(error, response, body) {
			callback(error);
		});

	} else {
		callback("Please set IFTTT_MAKER_TOKEN env variable");
	}
}