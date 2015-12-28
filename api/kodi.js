var devices = require("../config/devices.json");
var request = require('request');
var util = require('util');

module.exports.notify = notify;

function notify() {
	var servers = Object.keys(devices.kodi).map(function(server) {
		return devices.kodi[server].ip;
	});

	var jsonrpc = '{"jsonrpc":"2.0","id":1,"method":"Addons.ExecuteAddon","params":{"addonid":"script.securitycam"}}';
	servers.forEach(function(server) {
		request.get(util.format("http://%s/jsonrpc?request=%s", server, jsonrpc));
	});
}
