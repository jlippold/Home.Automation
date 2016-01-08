var express = require('express');
var insteon = require('./api/insteon');
var harmony = require('./api/harmony');
var lifx = require('./api/lifx');
var groups = require('./lib/groups');
var motion = require('./lib/motion');
var routes = express.Router();

//wire up /insteon to give  a list

// insteon on / offs
// http://localhost:3000/insteon/3c2cc5/on

routes.get('/insteon', function(req, res, next) {
	var id = req.params.id;
	insteon.listDevices(function(err, devices) {
		if (err) {
			res.status(500);
			res.send(err);
		} else {
			res.send(devices);
		}
	});
});

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

routes.get('/lifx/:id/on', function(req, res, next) {
	var id = req.params.id;
	lifx.setStatus(id, "on", function(err) {
		if (err) {
			res.status(500);
			res.send(err);
		} else {
			res.sendStatus(200);
		}
	});
});

routes.get('/lifx/:id/off', function(req, res, next) {
	var id = req.params.id;
	lifx.setStatus(id, "off", function(err) {
		if (err) {
			res.status(500);
			res.send(err);
		} else {
			res.sendStatus(200);
		}
	});
});


// group on / offs
routes.get('/groups', function(req, res, next) {
	var id = req.params.id;
	groups.list(function(err, devices) {
		if (err) {
			res.status(500);
			res.send(err);
		} else {
			res.send(devices);
		}
	});
});

// http://localhost:3000/groups/livingroom/off
routes.get('/groups/:id/on', function(req, res, next) {
	res.sendStatus(200);
	groups.setStatus(req.params.id, "on", function(err) {
		if (err) {
			console.log(err);
		}
	});
});

routes.get('/groups/:id/off', function(req, res, next) {
	res.sendStatus(200);
	groups.setStatus(req.params.id, "off", function(err) {
		if (err) {
			console.log(err);
		}
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
		console.log(err);
		if (err) {
			res.status(500);
			res.send(err);
		} else {
			res.sendStatus(200);
		}
	});
});

// http://localhost:3000	
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


// http://localhost:3000/motion/testFire/367fa8
// http://localhost:3000/motion/testFire/3699ae

routes.get('/motion/testFire/:device', function(req, res, next) {
	var device = req.params.device;
	motion.testFire(device, function(err, commands) {
		if (err) {
			res.status(500);
			res.send(err);
		} else {
			res.sendStatus(200);
		}
	});
});

module.exports = routes;