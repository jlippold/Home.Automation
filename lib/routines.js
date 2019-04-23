var schedule = require('node-schedule');
var routines = require('../devices/routines');
var api = require('../api');
var lib = require('../lib');
var async = require('async');

module.exports.run = run;
module.exports.list = list;
module.exports.init = init;


function init() {
    Object.keys(routines).forEach(function (r) {
        var routine = routines[r];
        if (routine.hasOwnProperty("cron")) {
            var j = schedule.scheduleJob(routine.cron, function () {
                if (routine.confirm) {
                    var message = `Would you like to run the ${routine.time} ${routine.description} routine as scheduled?`;
                    api.mobile.sendNotificationForRoutine(routine.description, message, r, function () {
                        console.log(`${routine.description} notification sent`);
                    });
                } else {
                    run(r, function () {
                        console.log(`${routine.description} completed`);
                    });
                }
            });
        }
    });
}


function list(callback) {
    var output = { routines: [] };
    Object.keys(routines).forEach(function (r) {
        var routine = routines[r];
        routine.key = r;
        output.routines.push(routine);
    });
    callback(null, output);
}

function run(key, callback) {
    if (!routines.hasOwnProperty(key)) {
        return callback("Routine " + key + " doesn't exist");
    }
    var routine = routines[key];
    console.log("Running: " + key);
    async.eachSeries(routine.actions, function (action, next) {
        if (action.type == "insteon") {
            return api.insteon.setStatusOfDevice(action.id, action.status, next);
        }
        if (action.type == "kodiRemote") {
            return api.kodi.execute(action.device, action.command, next);
        }
        if (action.type == "kodiChannel") {
            return lib.kodi.playChannelByName(action.device, action.param, next);
        }
    }, function (err) {
        callback(err, { status: "ok" });
    });
}