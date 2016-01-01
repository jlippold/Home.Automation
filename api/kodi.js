var devices = require("../config/devices.json");
var request = require('request');
var util = require('util');

module.exports.notify = notify;

function notify(motionDevice) {
	var servers = Object.keys(devices.kodi).map(function(server) {
		return devices.kodi[server].ip;
	});

	if (motionDevice.hasOwnProperty("camera")) {
		var jsonrpc = '{"jsonrpc":"2.0","id":1,"method":"Addons.ExecuteAddon","params":{"addonid":"script.securitycam_%s"}}';
		jsonrpc = util.format(jsonrpc, motionDevice.camera);
		
		servers.forEach(function(server) {
			request.get(util.format("http://%s/jsonrpc?request=%s", server, jsonrpc));
		});
	}
}