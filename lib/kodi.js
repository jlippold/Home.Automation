var async = require('async');
var nodeUtil = require('util');
var request = require('request');
var devices = require("../devices/").kodi;
var kodi = require("../lib/kodi");

module.exports.rpc = rpc;

function rpc(room, command, callback) {
    var device = devices[room];
    var json = device.commands[command];
    var options = {
        url: "http://" + device.ip + "/jsonrpc?request=" + JSON.stringify(json),
        auth: {
            user: process.env.KODI_USER,
            password: process.env.KODI_PASS
        },
        json: true
    };
    request(options, function (err, res, body) {
        if (err) console.error(url + ": " + err);
        return callback(err, body);
    });

}