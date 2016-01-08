var devices = require("../config/devices.json");
var insteon = require("../api/insteon");
var request = require('request');
var util = require('util');
var moment = require('moment');


module.exports.pressed = pressed;

function pressed(device, key) {
	key = translateKey(key);
	console.log(key);
	if (!device.hasOwnProperty("actions")) {
		return;
	}

	if (!device.actions.hasOwnProperty(key)) {
		return;
	}

	var action = device.actions[key];
	console.log(action);
	if (action.type == "insteon") {
		insteon.setStatusOfDevice(action.id, action.status, function(err) {

		});
	}
}

function translateKey(key) {
	var newkey;
	switch (key) {
		case 1:
			newkey = 2;
			break;
		case 2:
			newkey = 1;
			break;
		case 3:
			newkey = 4;
			break;
		case 4:
			newkey = 3;
			break;
		case 5:
			newkey = 6;
			break;
		case 6:
			newkey = 5;
			break;
		case 7:
			newkey = 8;
			break;
		case 8:
			newkey = 7;
			break;
	}
	return newkey;
}