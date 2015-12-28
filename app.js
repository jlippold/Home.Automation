var express = require('express');
var async = require('async');
var insteon = require('./api/insteon');
var harmony = require('./api/harmony');
var router = require('./router');
var app = express();

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
    insteonHub: function(next){
    	insteon.register(function() {
    		next();
    	});
    },
    harmonyActivities: function(next){
    	harmony.init(function() {
    		next();
    	});
    },
    express: ['insteonHub', 'harmonyActivities', function(next, results){
        app.listen(3000);
        console.log("web server is running");
        next();
    }],
}, function(err, results) {
	
});


module.exports = app;