var express = require('express');
var insteon = require('./api/insteon');
var harmony = require('./api/harmony');
var routes = express.Router();


// insteon on / offs
// http://localhost:3000/insteon/3c2cc5/on
routes.get('/insteon/:id/on', function(req, res, next) {
	var id = req.params.id;
	insteon.setStatusOfDevice(id, "on", function(err) {
		if (err) {
			res.status(500);
			res.send(err);
		} else {
			res.sendStatus(200);
		}
	});
});

routes.get('/insteon/:id/off', function(req, res, next) {
	var id = req.params.id;
	insteon.setStatusOfDevice(id, "off", function(err) {
		if (err) {
			res.status(500);
			res.send(err);
		} else {
			res.sendStatus(200);
		}
	});
});

// room on / offs
// http://localhost:3000/room/bedroom/on
routes.get('/room/:room/on', function(req, res, next) {
	api.setStatusForRoom(req.params.room, "on", function() {
		res.sendStatus(200);
	});
});

routes.get('/room/:room/off', function(req, res, next) {
	api.setStatusForRoom(req.params.room, "off", function() {
		res.sendStatus(200);
	});
});

// http://localhost:3000/harmony/hubs
routes.get('/harmony/hubs', function(req, res, next) {
	harmony.listHubs(function(hubs) {
		res.send(hubs);
	});
});

// http://localhost:3000/harmony/hubs/livingroom
routes.get('/harmony/hubs/:hub', function(req, res, next) {
	var hub = req.params.hub;
	harmony.listRoomCommands(hub, function(err, commands) {
		res.send(commands);
	});
});

// http://localhost:3000/harmony/hubs/bedroom/activities/16476999
routes.get('/harmony/hubs/:hub/activities/:activity', function(req, res, next) {
	var hub = req.params.hub;
	var activity = req.params.activity;
	harmony.runActivity(hub, activity, function(err) {
		if (err) {
			res.status(500);
			res.send(err);
		} else {
			res.sendStatus(200);
		}
	});
});

// http://localhost:3000/harmony/hubs/bedroom/devices/30573030/commands/VolumeUp
routes.get('/harmony/hubs/:hub/devices/:device/commands/:command', function(req, res, next) {
	var hub = req.params.hub;
	var device = req.params.device;
	var command = req.params.command;
	harmony.runCommand(hub, device, command, function(err) {
		if (err) {
			res.status(500);
			res.send(err);
		} else {
			res.sendStatus(200);
		}
	});
});

module.exports = routes;