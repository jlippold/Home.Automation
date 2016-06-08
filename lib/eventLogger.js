module.exports.log = log;

var jsonfile = require('jsonfile');
var fs = require('fs');
var moment = require('moment');
var async = require('async');
var path = require('path');
var os = require('os');

var eventLogFolder = (os.type() == "Darwin" ? "/Users/Jed/Downloads/" : "G:\\data\\motion");

function log(device, action) {

	var filename = moment().format("YYYY-MM-DD") + ".log";
	var fullpath = path.join(eventLogFolder, filename);

	async.auto({
		folderExists: function(moveNext, results) {
			fs.access(eventLogFolder, fs.F_OK, function(err) {
				moveNext(err);
			});
		},
		fileExits: ['folderExists', function(moveNext, results) {
			fs.access(fullpath, fs.F_OK, function(err) {
				if (err) {
					moveNext(null, false);
				} else {
					moveNext(null, true);
				}
			});
		}],
		readFile: ['fileExits', function(moveNext, results) {
			if (results.fileExits) {
				jsonfile.readFile(fullpath, function(err, obj) {
					moveNext(err, obj);
				});
			} else {
				moveNext(null, {
					date: moment().format("YYYY-MM-DD"),
					events: []
				});
			}

		}],
		writeFile: ['readFile', function(moveNext, results) {
			var logs = results.readFile;

			logs.events.push({
				type: action.event,
				location: action.location,
				date: (new Date).getTime()
			});

			jsonfile.writeFile(fullpath, logs, {
				spaces: 2
			}, function(err) {
				moveNext(err);
			});
		}]
	}, function(err) {
		if (err) {
			console.error(err);
		}
	});

}
