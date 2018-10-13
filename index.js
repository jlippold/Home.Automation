var express = require('express');
var async = require('async');
var insteon = require('./api/insteon');
var harmony = require('./api/harmony');
var lifx = require('./api/lifx');
var lib = require("./lib");
var cams = require('./api/cams');
var router = require('./router');
var dispatcher = require('./lib/dispatch');
var cors = require('cors');
var auth = require('http-auth');
var fs = require('fs');

var app = express();
var server = require('http').createServer(app);
var io;

if (process.env.NODE_ENV == "production") {

	var secureServer = require('https').createServer({
		key: fs.readFileSync(process.env.CERT_KEY),
		cert: fs.readFileSync(process.env.CERT)
	}, app);

	io = require('socket.io').listen(secureServer);
	io.set('transports', ['websocket']);
}


require("console-stamp")(console, {
	pattern: ".", 
	colors: {
		stamp: 'blue',
		label: 'green',
		metadata: 'red'
	}
});


/*
var basic = auth.basic({
	realm: "Jeds House.",
	file: __dirname + "/config/users.htpasswd"
});

app.use(function(req, res, next) {
	if (req.headers["x-arr-ssl"]) {
		auth.connect(basic)(req, res, next);
	} else {
		next();
	}
});
*/

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(cors({
	origin: 'http://localhost:3000'
}));

app.use(express.static(__dirname + '/public'));

var prefix = "home";

app.use("/", router); //for legacy calls
app.use("/" + prefix, router);
app.use("/" + prefix, express.static(__dirname + '/public'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	res.status(404);
	// default to plain-text. send()
	res.type('txt').send('Not found');
});

// error handlers
app.use(function (err, req, res, next) {
	console.error(err);
	res.status(err.status || 500);
	res.type('txt').send(JSON.stringify(err));
});

async.auto({
	insteonHub: function (next) {
		if (process.env.NODE_ENV != "production") {
			console.log("skipping insteon hub")
			return next();
		}
		insteon.register(function (err) {
			console.log("connected to insteon hub");
			next(err);
		});
	},
	lifxClient: function (next) {
		lifx.init(function () {
			console.log("connected to lifx client");
			next();
		});
	},
	harmonyActivities: function (next) {
		console.log("Starting harmony");
		harmony.init(function (err) {
			console.log("retrieved harmony commands");
			next(err);
		});
	},
	killStreams: function(next) {
		var spawn = require('child_process').spawn;
		spawn("taskkill", ["/IM", "ffmpeg.exe", "/F"], { windowsHide: true});
		next();
	},
	cams: function(next) {
		cams.init(next);
	},
	deviceList: ['killStreams', 'cams', 'insteonHub', 'harmonyActivities', function (next) {
		dispatcher.devices(function (err, devices) {
			console.log("got device list");
			next(err);
		});
	}],
	routines: ['deviceList', function(next) {
		lib.routines.init();
		next();
	}],
	sockets: ['lifxClient', 'routines', function (next) {

		server.listen(3000, function () {
			console.log("API Listening from 3000");
		});

		if (process.env.NODE_ENV == "production") {
			secureServer.listen(3333, function () {
				console.log("Socket server running from 3333");
			});
			dispatcher.server(io);
			io.on('connection', function (socket) {
				dispatcher.broadcastDevices();
			});
		}
		next();
	}]
}, function (err, results) {
	if (err) {
		process.exit(1);
	}
});


module.exports = app;