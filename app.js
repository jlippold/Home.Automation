var Insteon = require('home-controller').Insteon;
var hub = new Insteon();
var request = require('request');
var util = require('util');
var motion = hub.motion("367fa8");

motion.on('motion', function() {
  console.log('Motion detected at ' + (new Date()));
	notifyXBMC();
});

hub.connect("192.168.1.104", function() {
  console.log("connected to hub");
  notifyXBMC();
});

function notifyXBMC() {
	var servers = [
		"192.168.1.85",
		"192.168.1.103"
	];

	var jsonrpc = '{"jsonrpc":"2.0","id":1,"method":"Addons.ExecuteAddon","params":{"addonid":"script.securitycam"}}';

	servers.forEach(function(server) {
		request.get(util.format("http://%s/jsonrpc?request=%s", server, jsonrpc));
	});

}