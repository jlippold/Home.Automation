var express = require('express');
var api = require("./api/");
var lib = require("./lib/");
var path = require('path');
var routes = express.Router();

routes.use(function (req, res, next) {
	if (req.hostname.indexOf("jed.bz") > -1) {
		var err = new Error('not Found');
		err.status = 404;
		return next(err);
	}
	next()
})

routes.get('/', function (req, res, next) {
	res.redirect('dashboard.html');
});

// https://home.jed.bz:999/home/api/alexa?action=configure
routes.get('/api/alexa', function (req, res, next) {
	lib.activities.alexa(req.query.action, function (err, results) {
		res.send(results);
	});
});

// https://home.jed.bz:999/home/api/alexa/stream/anchorman?key=XXX
routes.get('/api/alexa/stream/:title', function (req, res, next) {
	if (req.query.key != process.env.ALEXA_KEY ) {
		//console.log("bad key", req.query, process.env.ALEXA_KEY );
		return res.send(null, "bad key");
	}
	api.alexa.findByTitle(req.params.title, function (err, url) {
		if (err) console.log(err);
		if (err) return res.send(err);
		res.redirect(url);
	});
});

routes.get('/api/status', function (req, res, next) {
	lib.activities.status(function (err, results) {
		res.send(results);
	});
});

routes.get('/api/refresh', function (req, res, next) {
	lib.dispatch.updateStatus();
	res.send("Refreshing");
});

routes.get('/api/groups', function (req, res, next) {
	var id = req.params.id;
	lib.groups.list(function (err, devices) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(devices);
		}
	});
});

routes.get('/alexa/:deviceType/:status', function (req, res, next) {
	console.log("Alexa command called");
	var deviceType = req.params.deviceType;
	var status = req.params.status;
	if (["on", "off"].indexOf(status.toLowerCase()) == -1) {
		return res.status(404);
	}

	res.send({status: "enqueue"});
	api.alexa.runAlexaAction(deviceType, status, function(err, json) {
		if (err) {
			console.error(deviceType, status, err, json);
		}
	});
});

routes.get('/televisions', function (req, res, next) {
	api.kodi.listDevices(function (err, devices) {
		res.send(devices);
	});
});

routes.get('/televisions/:room', function (req, res, next) {
	var room = req.params.room;
	lib.kodi.nowPlaying(room, function (err, json) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(json);
		}
	});
});

routes.get('/televisions/:room/images', function (req, res, next) {
	var image = req.query.image;
	var room = req.params.room;
	
	if (image && room) {
		lib.kodi.getImage(room, image, res);
	} else {
		res.status(404);
	}
});


routes.get('/televisions/:room/commands/:command', function (req, res, next) {
	var room = req.params.room;
	var command = req.params.command;

	api.kodi.execute(room, command, function (err, json) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(json);
		}
	});
});

routes.get('/televisions/:room/shows/:showid', function (req, res, next) {
	var room = req.params.room;
	var showid = req.params.showid;

	lib.kodi.episodes(room, showid, function (err, json) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(json);
		}
	});
});

routes.get('/televisions/:room/channel/:channelName', function (req, res, next) {
	var channelName = req.params.channelName;
	var room = req.params.room;

	lib.kodi.playChannelByName(room, channelName, function (err, json) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(json);
		}
	});
});

routes.get('/televisions/:room/play/:type/:id', function (req, res, next) {
	var room = req.params.room;
	var type = req.params.type;
	var id = req.params.id;

	lib.kodi.play(room, type, id, function (err, json) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(json);
		}
	});
});

routes.get('/insteon', function (req, res, next) {
	api.insteon.listDevices(function (err, devices) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(devices);
		}
	});
});

// http://localhost:3000/insteon/3f4b99/dim/45
routes.get('/insteon/:id/dim/:level', function (req, res, next) {
	var id = req.params.id.toUpperCase();
	var level = req.params.level;
	api.insteon.dim(id, level, function (err) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.sendStatus(200);
		}
	});
});

// http://localhost:3000/insteon/1f527c/toggle
routes.get('/insteon/:id/:status', function (req, res, next) {
	var id = req.params.id.toUpperCase();
	var status = req.params.status;

	if (["on", "off", "toggle"].indexOf(status) > -1) {
		api.insteon.setStatusOfDevice(id, status, function (err) {
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


routes.get('/switchmate', function (req, res, next) {
	api.switchmate.listDevices(function (err, devices) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(devices);
		}
	});
});

routes.get('/switchmate/:id/:status', function (req, res, next) {
	var id = req.params.id;
	var status = req.params.status;

	if (["on", "off"].indexOf(status) > -1) {
		api.switchmate.setStatusOfDevice(id, status, function (err) {
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

routes.get('/ring', function (req, res, next) {
	api.ring.listDevices(function (err, devices) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(devices);
		}
	});
});

// http://localhost:3000/ring/2686950/status
routes.get('/ring/:id/:status', function (req, res, next) {
	var id = req.params.id.toUpperCase();
	var status = req.params.status;

	if (["on", "off", "toggle"].indexOf(status) > -1) {
		api.ring.setStatusOfDevice(id, status, function (err) {
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

routes.get('/garage', function (req, res, next) {
	api.myq.listDevices(function (err, devices) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(devices);
		}
	});
});

// http://localhost:3000/garage/2686950/status
routes.get('/garage/:id/:status', function (req, res, next) {
	var id = req.params.id.toUpperCase();
	var status = req.params.status;

	if (["on", "off", "toggle"].indexOf(status) > -1) {
		api.myq.setStatusOfDevice(id, status, function (err) {
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

routes.get('/lifx/:id/:status', function (req, res, next) {
	var id = req.params.id;
	var status = req.params.status;

	if (["on", "off", "toggle"].indexOf(status) > -1) {
		api.lifx.setStatusOfDevice(id, status, function (err) {
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

routes.get('/lifx', function (req, res, next) {
	var id = req.params.id;
	api.lifx.listDevices(function (err, devices) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(devices);
		}
	});
});

// http://localhost:3000/thermostat/heat/on

routes.get('/thermostat/:id/:status', function (req, res, next) {
	var id = req.params.id;
	var status = req.params.status;

	if (["on", "off", "toggle"].indexOf(status) > -1) {

		api.thermostat.setStatusOfDevice(id, status, function (err) {

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
routes.get('/groups/:id/on', function (req, res, next) {
	res.sendStatus(200);
	lib.groups.setStatus(req.params.id, "on", function (err) {
		if (err) {
			console.error(err);
		}
	});
});

routes.get('/groups/:id/off', function (req, res, next) {
	res.sendStatus(200);
	lib.groups.setStatus(req.params.id, "off", function (err) {
		if (err) {
			console.error(err);
		}
	});
});


// http://localhost:3000/sequence/night_mode/
routes.get('/sequence/:id', function (req, res, next) {
	res.sendStatus(200);
	lib.sequences.runSequence(req.params.id, function (err) {
		if (err) {
			console.error(err);
		}
	});
});



// http://localhost:3000/harmony/hubs
routes.get('/harmony/hubs', function (req, res, next) {
	api.harmony.listHubs(function (hubs) {
		res.send(hubs);
	});
});

// http://localhost:3000/harmony/hubs/livingroom
routes.get('/harmony/hubs/:hub', function (req, res, next) {
	var hub = req.params.hub;
	api.harmony.listRoomCommands(hub, function (err, commands) {
		res.send(commands);
	});
});

// http://localhost:3000/harmony/hubs/bedroom/activities/16476999
routes.get('/harmony/hubs/:hub/activities/:activity', function (req, res, next) {
	var hub = req.params.hub;
	var activity = req.params.activity;
	res.sendStatus(200);

	api.harmony.runActivity(hub, activity, function (err) {
		if (err) {
			console.error(err);
		}
	});
});

// http://localhost:3000/harmony/hubs/livingroom/activities/16476999/toggle
routes.get('/harmony/hubs/:hub/activities/:activity/toggle', function (req, res, next) {
	var hub = req.params.hub;
	var activity = req.params.activity;
	res.sendStatus(200);

	api.harmony.toggleActivity(hub, activity, function (err) {
		if (err) {
			console.error(err);
		}
	});
});

// http://localhost:3000	
routes.get('/harmony/hubs/:hub/devices/:device/commands/:command', function (req, res, next) {
	var hub = req.params.hub;
	var device = req.params.device;
	var command = req.params.command;
	api.harmony.runCommand(hub, device, command, function (err) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.sendStatus(200);
		}
	});
});

routes.get('/services/torrent', function (req, res, next) {
	api.services.uTorrent(function (err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(result);
		}
	});
});

routes.get('/services/nzb', function (req, res, next) {
	api.services.nzbGet(function (err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(result);
		}
	});
});

routes.get('/services/emby', function (req, res, next) {
	api.services.emby(function (err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(result);
		}
	});
});

routes.get('/services/router', function (req, res, next) {
	api.services.router(function (err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(result);
		}
	});
});

routes.get('/services/server', function (req, res, next) {
	api.services.server(function (err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.header("Content-Type", "application/json");
			res.send(result);
		}
	});
});

routes.get('/services/icloud', function (req, res, next) {
	api.services.icloud(function (err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.header("Content-Type", "application/json");
			res.send(result);
		}
	});
});

routes.get('/services/weather', function (req, res, next) {
	api.services.weather(function (err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.header("Content-Type", "application/json");
			res.send(result);
		}
	});
});

routes.post('/services/icloud/alert', function (req, res, next) {
	var device = req.body.device;

	api.services.icloudAlert(device, function (err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.header("Content-Type", "application/json");
			res.send(result);
		}
	});
});

routes.post('/mobile/register', function (req, res, next) {
	var deviceId = req.body.deviceId;
	var deviceName = req.body.deviceName;
	if (deviceName && deviceId) {

	} else {
		return res.status(500);
	}
	api.mobile.addDevice(deviceId, deviceName, function (err) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.sendStatus(200);
		}
	});
});

routes.post('/mobile/snooze', function (req, res, next) {
	var minutes = req.body.minutes;
	lib.motion.snooze(minutes, function (err) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.sendStatus(200);
		}
	});
});

routes.get('/snooze/:minutes', function (req, res, next) {
	var minutes = req.params.minutes;
	lib.motion.snooze(minutes, function (err) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.sendStatus(200);
		}
	});
});

routes.get('/snooze', function (req, res, next) {
	lib.motion.snoozeEnabled(function (err, result) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(result);
			//res.sendStatus(200);
		}
	});
});

routes.get('/routines', function (req, res, next) {
	lib.routines.list(function (err, routines) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(routines);
		}
	});
});

routes.get('/routines/:routine', function (req, res, next) {
	lib.routines.run(req.params.routine, function (err, routines) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(routines);
			//res.sendStatus(200);
		}
	});
});

// http://192.168.1.110:3000/motion/testFire/367FA8
// http://localhost:3000/motion/testFire/3699ae

routes.get('/motion/testFire/:device', function (req, res, next) {
	var device = req.params.device;
	lib.motion.testFire(device, function (err, commands) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.sendStatus(200);
		}
	});
});

// https://jed.bz/home/cameras/live/garage
routes.get("/cameras/live/:camera", function (req, res, next) {
	var camera = req.params.camera;
	var cam = api.cams.cameras.find(function (c) {
		return c.name == camera;
	});

	if (!cam) {
		res.status(500);
		console.error("Camera not found", camera);
		return res.send("Camera not found");
	} else {
		var ip  = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		var local = ip.indexOf("192.168.1") > -1;
		api.cams.liveStream(cam, local, function(err) {
			if (err) return res.send(err);
			return res.send({stream: 'https://home.jed.bz:999/stream/' + cam.name + '.m3u8'});
		});
	}

});

routes.get("/cameras/recordings", function (req, res, next) {
	api.cams.getRecordings(function (err, recordings) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.send(recordings);
		}
	});
});

routes.get("/cameras/recordings/:recording_id/image", function (req, res, next) {
	var recording_id = req.params.recording_id;
	api.cams.getRecordingById(recording_id, function (err, recording) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.redirect("https://jed.bz/camera-ftp/" +
				path.basename(path.dirname(recording.jpg)) + "/" +
				path.basename(recording.jpg));
		}
	});
});

routes.get("/cameras/recordings/:recording_id/video", function (req, res, next) {
	var recording_id = req.params.recording_id;
	api.cams.getRecordingById(recording_id, function (err, recording) {
		if (err) {
			res.status(500);
			res.send(err);
			console.error(err);
		} else {
			res.redirect("https://jed.bz/camera-ftp/" +
				path.basename(path.dirname(recording.mp4)) + "/" +
				path.basename(recording.mp4));
		}
	});
});

module.exports = routes;