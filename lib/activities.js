var async = require("async");
var api = require("../api/");
var lib = require("../lib/");

module.exports.status = status;

function status(callback) {
	lib.dispatch.devices(function(err, devices) {
		callback(err, devices);
	});
}