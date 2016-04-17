var devices = require("../config/devices.json");
var insteon = require("../api/insteon");
var thermostat = require("../api/thermostat");
var harmony = require("../api/harmony");
var groups = require("../lib/groups");
var request = require("request");
var util = require("util");
var moment = require("moment");

/*
LR

1 = TV			2 = FP

3 = Cabinets	4 = Cora

5 = DRoom On	6 = DRoom Off

7 = House Off	8 = Bedroom	Off


BR

1 = TV			2 = FP

3 = BedOff 		4 = Ac On

5 = Lroom Off	6 = Ac Off

7 = Dining Off	8 = Heat On


*/

module.exports.pressed = pressed;

function pressed(device, key) {
	key = translateKey(key);

	if (!device.hasOwnProperty("actions")) {
		return;
	}

	if (!device.actions.hasOwnProperty(key)) {
		return;
	}

	var action = device.actions[key];
	console.log(action);

	function swallowCallback(err) {
		if (err) {
			console.log(err);
		}
	}

	if (action.type == "insteon") {
		insteon.setStatusOfDevice(action.id, action.status, swallowCallback);
	}

	if (action.type == "harmony") {
		if (action.status == "toggle") {
			harmony.toggleActivity(action.id, action.activity, swallowCallback);
		} else {
			harmony.runActivity(action.id, action.activity, swallowCallback);
		}
	}


	if (action.type == "ecobee") {
		thermostat.setStatusOfDevice(action.id, action.status, swallowCallback);
	}

	if (action.type == "group") {
		groups.setStatus(action.id, action.status, swallowCallback);
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