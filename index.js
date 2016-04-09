var express = require('express');
var async = require('async');
var insteon = require('./api/insteon');
var harmony = require('./api/harmony');
var router = require('./router');
var dispatcher = require('./lib/dispatch');
var cors = require('cors');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//expose public folder as static assets
app.use(express.static(__dirname + '/public'));

app.use(cors({
  origin: 'http://localhost:8080'
}));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.status(404);
	// default to plain-text. send()
	res.type('txt').send('Not found');
});

// error handlers
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: app.get('env') === 'development' ? err : {}
	});
});


async.auto({
	insteonHub: function(next) {
		insteon.register(function() {
			console.log("connected to insteon hub");
			next();
		});
	},
	harmonyActivities: function(next) {
		harmony.init(function() {
			console.log("retrieved harmony commands");
			next();
		});
	},
	deviceList: ['insteonHub', 'harmonyActivities', function(next) {
		dispatcher.devices(function(err, devices) {
			console.log("got device list");
			next(err);
		});
	}],
	express: ['deviceList', function(next, results) {
		//app.listen(3000);
		console.log("web server is running");
		next();
	}],
	sockets: ['express', function(next) {
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

});


module.exports = app;