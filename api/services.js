var request = require('request');
var moment = require('moment');
var async = require('async');
var nzbget = require('nzbget-nodejs');
var torrent = require('utorrent-api');

var embyHost = process.env.embyHost || "localhost:8096";
var embyToken = process.env.embyToken || "";
var uTorrentHost = process.env.uTorrentHost || "localhost";
var uTorrentPort = process.env.uTorrentPort || "8080";
var uTorrentUser = process.env.uTorrentUser || "";
var uTorrentPass = process.env.uTorrentPass || "";
var nzbGetHost = process.env.nzbGetHost || "localhost";
var nzbGetPort = process.env.nzbGetPort || 6789;
var nzbGetUser = process.env.nzbGetUser || "";
var nzbGetPass = process.env.nzbGetPass || "";
var orbiBaseUrl = process.env.orbiBaseUrl || "http://192.168.1.1";
var orbiUser = process.env.orbiUser || "admin";
var orbiPass = process.env.orbiPass || "Orbi";

module.exports.emby = emby;
module.exports.uTorrent = uTorrent;
module.exports.nzbGet = nzbGet;
module.exports.router = router;
module.exports.server = server;

function nzbGet(callback) {

	var nzb = new nzbget({
		host: nzbGetHost,
		port: nzbGetPort,
		username: nzbGetUser,
		password: nzbGetPass
	});
	async.parallel({
			downloadRate: function(next) {
				nzb.status(function(err, res) {
					if (err) {
						return next(err);
					}
					return next(err, res.DownloadRate);
				});
			},
			downloadQueue: function(next) {
				nzb.listgroups(function(err, res) {
					if (err) {
						return next(err);
					}
					return next(err, res.length);
				});
			}
		},
		function(err, results) {
			results.rawDownloadRate = results.downloadRate;
			results.downloadRate = bytesToSize(results.downloadRate) + '/s';
			callback(err, results);
		});
}

function uTorrent(callback) {

	var utorrent = new torrent(uTorrentHost, uTorrentPort);
	utorrent.setCredentials(uTorrentUser, uTorrentPass);
	utorrent.call('list', function(err, t) {
		if (err) {
			return callback(err);
		}

		var up = 0;
		var down = 0;
		t.torrents.forEach(function(t) {
			up += t[8];
			down += t[9];
		});

		return callback(err, {
			upload: bytesToSize(up) + '/s',
			download: bytesToSize(down) + '/s',
			rawUpload: up,
			rawDownload: down
		});
	});
}

function emby(callback) {
	var url = "http://" + embyHost + "/emby/Sessions";
	var options = {
		headers: {
			"x-mediabrowser-token": embyToken
		},
		json: true
	};
	request(url, options, function(err, r, sessions) {
		if (err) {
			return callback(err);
		}
		var arr = [];
		sessions.forEach(function(session) {
			if (session.hasOwnProperty("TranscodingInfo") && session.hasOwnProperty("NowPlayingItem")) {
				arr.push({
					user: session.UserName,
					client: session.Client,
					image: '/emby/Users/' + session.UserId + '/Images/Primary?tag=' + session.UserPrimaryImageTag,
					title: session.NowPlayingItem.Type == "Episode" ? session.NowPlayingItem.SeriesName : session.NowPlayingItem.Name
				});
			}
		});

		arr.sort((a, b) => a.name.localeCompare(b.name));

		callback(err, arr);
	});
}

function router(callback) {
	var url = orbiBaseUrl + '/traffic.htm';
	var options = {
		'strictSSL': false,
		'auth': {
			'user': orbiUser,
			'pass': orbiPass,
			'sendImmediately': false
		}
	};
	var loops = 6;
	var pause = 2500;

	async.timesSeries(loops, function(n, next) {
		request(url, options, function(err, r, html) {
			var stats = {
				inbound: 0,
				outbound: 0,
				systime: null
			};
			if (!err) {
				var lines = html.split("\n");
				lines.forEach(function(line) {
					if (line.indexOf("var traffic_today_up") > -1) {
						stats.outbound = line.replace(/\D/g, '');
					}
					if (line.indexOf("var traffic_today_down") > -1) {
						stats.inbound = line.replace(/\D/g, '');
					}
				});
				stats.systime = moment();
			}

			setTimeout(function() {
				next(null, stats);
			}, pause);
		});
	}, function(err, stats) {

		var upload = [];
		var download = [];
		var total = 0;
		stats.forEach(function(stat, idx) {
			if (stats.length > idx + 1 && stat.systime) {
				total += 1;
				var bytesIn, bytesOut;
				var seconds = (stats[idx + 1].systime.diff(stats[idx].systime, 'milliseconds')) / 1000;

				bytesIn = (stats[idx + 1].inbound - stats[idx].inbound) / seconds;
				bytesOut = (stats[idx + 1].outbound - stats[idx].outbound) / seconds;

				upload.push(bytesOut);
				download.push(bytesIn);
			}
		});

		var downloadAvg = (download.reduce((a, b) => a + b, 0) / total) * 1024 * 1024; //convert MB to B
		var uploadAvg = (upload.reduce((a, b) => a + b, 0) / total) * 1024 * 1024;
		var uploadMax = 600 * 1024;
		var downloadMax = 5000 * 1024;

		return callback(err, {
			upload: {
				average: uploadAvg,
				maximum: uploadMax,
				percentage: uploadAvg / uploadMax > 1 ? 1 : uploadAvg / uploadMax,
				formatted: {
					average: bytesToSize(uploadAvg) + "/s",
					maximum: bytesToSize(uploadMax) + "/s",
					percentage: Math.floor((uploadAvg / uploadMax) * 100).toFixed(1) + "%"
				}
			},
			download: {
				average: downloadAvg,
				maximum: downloadMax,
				percentage: downloadAvg / downloadMax > 1 ? 1 : downloadAvg / downloadMax,
				formatted: {
					average: bytesToSize(downloadAvg) + "/s",
					maximum: bytesToSize(downloadMax) + "/s",
					percentage: Math.floor((downloadAvg / downloadMax) * 100).toFixed(1) + "%"
				}
			}
		});
	});
}

function server(callback) {
	var spawn = require('child_process').spawn;
	var path = 'D://Scripts//stats//ServerStats.exe';
	if (!require('fs').existsSync(path)) {
		return callback("file not found");
	}
	var child = spawn(path);
	var output = "";
	var err = "";
	child.stdout.on('data',
		function(data) {
			output += data;
		});
	child.stderr.on('data', function(data) {
		err += data;
	});

	child.on('close', function(code) {
		callback(err, output);
	});
}

function bytesToSize(bytes) {
	var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	if (bytes == 0) return '0 Byte';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};