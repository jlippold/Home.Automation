var express = require('express');
var api = require("./api/");
var lib = require("./lib/");
var path = require('path');
var routes = express.Router();

routes.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname, '/public/source.html'));
});

routes.get('/api/status', function(req, res, next) {
	lib.activities.status(function(err, results) {
		res.send(results);
	});
});

routes.get('/api/refresh', function(req, res, next) {
	lib.dispatch.updateStatus();
	res.send("Refreshing");
});

routes.get('/api/groups', function(req, res, next) {
	var id = req.params.id;
	lib.groups.list(function(err, devices) {
		if (err) {
			res.status(500);
			res.send(err);
			console.log(err);
		} else {
			res.send(devices);
		}
	});
});

routes.get('/insteon', function(req, res, next) {
	api.insteon.listDevices(function(err, devices) {
		if (err) {
			res.status(500);
			res.send(err);
			console.log(err);
		} else {
			res.send(devices);
		}
	});
});

// http://localhost:3000/insteon/3f4b99/dim/45
routes.get('/insteon/:id/dim/:level', function(req, res, next) {
	var id = req.params.id.toUpperCase();
	var level = req.params.level;
	api.insteon.dim(id, level, function(err) {
		if (err) {
			res.status(500);
			res.send(err);
			console.log(err);
		} else {
			res.sendStatus(200);
		}
	});
});

// http://localhost:3000/insteon/1f527c/toggle
routes.get('/insteon/:id/:status', function(req, res, next) {
	var id = req.params.id.toUpperCase();
	var status = req.params.status;

	if (["on", "off", "toggle"].indexOf(status) > -1) {
		api.insteon.setStatusOfDevice(id, status, function(err) {
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

// http://localhost:3000/lifx/d073d5125481/toggle

routes.get('/lifx/:id/:status', function(req, res, next) {
	var id = req.params.id;
	var status = req.params.status;

	if (["on", "off", "toggle"].indexOf(status) > -1) {
		api.lifx.setStatusOfDevice(id, status, function(err) {
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

routes.get('/lifx', function(req, res, next) {
	var id = req.params.id;
	api.lifx.listDevices(function(err, devices) {
		if (err) {
			res.status(500);
			res.send(err);
			console.log(err);
		} else {
			res.send(devices);
		}
	});
});

// http://localhost:3000/thermostat/heat/on

routes.get('/thermostat/:id/:status', function(req, res, next) {
	var id = req.params.id;
	var status = req.params.status;

	if (["on", "off", "toggle"].indexOf(status) > -1) {

		api.thermostat.setStatusOfDevice(id, status, function(err) {

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


// http://localhost:3000/groups/livingroom/off
routes.get('/groups/:id/on', function(req, res, next) {
	res.sendStatus(200);
	lib.groups.setStatus(req.params.id, "on", function(err) {
		if (err) {
			console.log(err);
		}
	});
});

routes.get('/groups/:id/off', function(req, res, next) {
	res.sendStatus(200);
	lib.groups.setStatus(req.params.id, "off", function(err) {
		if (err) {
			console.log(err);
		}
	});
});


// http://localhost:3000/harmony/hubs
routes.get('/harmony/hubs', function(req, res, next) {
	api.harmony.listHubs(function(hubs) {
		res.send(hubs);
	});
});

// http://localhost:3000/harmony/hubs/livingroom
routes.get('/harmony/hubs/:hub', function(req, res, next) {
	var hub = req.params.hub;
	api.harmony.listRoomCommands(hub, function(err, commands) {
		res.send(commands);
	});
});

// http://localhost:3000/harmony/hubs/bedroom/activities/16476999
routes.get('/harmony/hubs/:hub/activities/:activity', function(req, res, next) {
	var hub = req.params.hub;
	var activity = req.params.activity;
	res.sendStatus(200);

	api.harmony.runActivity(hub, activity, function(err) {
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

	api.harmony.toggleActivity(hub, activity, function(err) {
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
	api.harmony.runCommand(hub, device, command, function(err) {
		if (err) {
			res.status(500);
			res.send(err);
			console.log(err);
		} else {
			res.sendStatus(200);
		}
	});
});

routes.get('/services/torrent', function(req, res, next) {
	api.services.uTorrent(function(err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.log(err);
		} else {
			res.send(result);
		}
	});
});

routes.get('/services/nzb', function(req, res, next) {
	api.services.nzbGet(function(err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.log(err);
		} else {
			res.send(result);
		}
	});
});

routes.get('/services/emby', function(req, res, next) {
	api.services.emby(function(err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.log(err);
		} else {
			res.send(result);
		}
	});
});

routes.get('/services/router', function(req, res, next) {
	api.services.router(function(err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.log(err);
		} else {
			res.send(result);
		}
	});
});

routes.get('/services/server', function(req, res, next) {
	api.services.server(function(err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.log(err);
		} else {
			res.json(result);
		}
	});
});


// http://localhost:3000/motion/testFire/367fa8
// http://localhost:3000/motion/testFire/3699ae

routes.get('/motion/testFire/:device', function(req, res, next) {
	var device = req.params.device;
	lib.motion.testFire(device, function(err, commands) {
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