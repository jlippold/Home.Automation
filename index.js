var express = require('express');
var async = require('async');
var insteon = require('./api/insteon');
var harmony = require('./api/harmony');
var lifx = require('./api/lifx');
var router = require('./router');
var dispatcher = require('./lib/dispatch');
var cors = require('cors');
var auth = require('http-auth');


var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

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

app.use(express.static(__dirname + '/public'));

app.use(cors({
	origin: 'http://localhost:8080'
}));

var prefix = "home";

app.use("/", router); //for legacy calls
app.use("/" + prefix, router);
app.use("/" + prefix, express.static(__dirname + '/public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.status(404);
	// default to plain-text. send()
	res.type('txt').send('Not found');
});

// error handlers
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.type('txt').send(JSON.stringify(err));
});



async.auto({
	insteonHub: function(next) {
		return next();
		insteon.register(function(err) {
			console.log("connected to insteon hub");
			next(err);
		});
	},
	lifxClient: function(next) {
		lifx.init(function() {
			console.log("connected to lifx client");
			next();
		});
	},
	harmonyActivities: function(next) {
		harmony.init(function(err) {
			console.log("retrieved harmony commands");
			next(err);
		});
	},
	deviceList: ['insteonHub', 'harmonyActivities', function(next) {
		dispatcher.devices(function(err, devices) {
			console.log("got device list");
			next(err);
		});
	}],
	sockets: ['lifxClient', 'deviceList', function(next) {
		var port = 3000;
		server.listen(port, function() {
			console.log("Listening from " + port);
		});
		dispatcher.server(io);
		io.on('connection', function(socket) {
			dispatcher.broadcastDevices();
		});
		console.log("socket server is running");
		next();
	}],
}, function(err, results) {
	if (err) {
		process.exit(1);
	}
});


module.exports = app;