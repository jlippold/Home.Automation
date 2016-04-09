var express = require('express');
var insteon = require('./api/insteon');
var harmony = require('./api/harmony');
var lifx = require('./api/lifx');
var groups = require('./lib/groups');
var motion = require('./lib/motion');
var activities = require('./lib/activities');
var routes = express.Router();

//wire up /insteon to give  a list

// insteon on / offs
// http://localhost:3000/insteon/1f527c/toggle

routes.get('/status', function(req, res, next) {
	activities.status(function(err, results) {
		res.send(results);	
	});
});

routes.get('/insteon', function(req, res, next) {
	var id = req.params.id;
	insteon.listDevices(function(err, devices) {
		if (err) {
			res.status(500);
			res.send(err);
			console.log(err);
		} else {
			res.send(devices);
		}
	});
});

routes.get('/insteon/:id/:status', function(req, res, next) {
	var id = req.params.id;
	var status = req.params.status;

	if (["on", "off", "toggle"].indexOf(status) > -1) {
		insteon.setStatusOfDevice(id, status, function(err) {
			if (err) {
				res.status(500);
				res.send(err);
				console.log(err);
			} else {
				res.sendStatus(200);
			}
		});
	} else {
		res.send("Bad status");
		res.status(500);
	}
});

routes.get('/lifx/:id/on', function(req, res, next) {
	var id = req.params.id;
	lifx.setStatus(id, "on", function(err) {
		if (err) {
			res.status(500);
			res.send(err);
			console.log(err);
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
			console.log(err);
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
			console.log(err);
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
	res.sendStatus(200);
	
	harmony.runActivity(hub, activity, function(err) {
		if (err) {
			console.log(err);
		}
	});
});

// http://localhost:3000/harmony/hubs/livingroom/activities/16476999/toggle
routes.get('/harmony/hubs/:hub/activities/:activity/toggle', function(req, res, next) {
	var hub = req.params.hub;
	var activity = req.params.activity;
	res.sendStatus(200);

	harmony.toggleActivity(hub, activity, function(err) {
		if (err) {
			console.log(err);
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
			console.log(err);
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
			console.log(err);
		} else {
			res.sendStatus(200);
		}
	});
});

module.exports = routes;