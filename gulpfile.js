var gulp = require('gulp');
var server = require('gulp-develop-server');
var jshint = require('gulp-jshint');
var spawn = require('child_process').spawn;
var gutil = require('gulp-util');

var api = [
	'./api/*.js',
	'./lib/*.js',
	'./config/*.json',
	'./*.js'
];

// run server 
gulp.task('server:start', ['lint'], function(done) {
	server.listen({
		path: './index.js'
	}, function() {
		done();
	});
});

// Lint server side code
gulp.task('lint', function() {
	return gulp.src(api)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});


gulp.task('webpack', function(done) {

	var webpack = spawn("webpack-dev-server", ['--quiet', '--colors']);
	gutil.log('webpack started');
	webpack.stdout.on('data', function(data) {
		gutil.log("" + data);
	});
	webpack.stderr.on('data', function(data) {
		gutil.log('webpack error: ' + data);
	});
	webpack.on('exit', function(code) {
		gutil.log('webpack exited with code ' + code);
	});

	done();
});


// restart server if app.js changed 
gulp.task('server:restart', ['lint'], function() {
    gulp.watch(api, server.restart); 
});

gulp.task('default', ['server:start', 'webpack'], function(done) {
    
    gulp.watch(api, ['server:restart']); 
  
	gutil.log("\n\n\tFrontend DEV server at: \n\t\t",
		gutil.colors.magenta("http://localhost:8080/webpack-dev-server/public\n")
	);
	gutil.log("\n\n\tExpress API server at: \n\t\t",
		gutil.colors.magenta("http://localhost:3000/\n")
	);
	done(); 
});
