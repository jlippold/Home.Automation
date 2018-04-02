var devices = require("../devices/").kodi;
var kodi = require("../lib/kodi");
var harmony = require("../api/harmony");
var groups = require("../lib/groups");

module.exports.listDevices = listDevices;
module.exports.execute = execute;

function listDevices(callback) {
    return callback(null, devices);
}

function execute(room, command, callback) {
    if (!devices.hasOwnProperty(room)) {
        return callback("room does not exist: " + room);
    }

    var device = devices[room];
    if (!device.commands.hasOwnProperty(command)) {
        return callback("command does not exist: " + command);
    }

    var action = device.commands[command];
    
    if (action.hasOwnProperty("jsonrpc") || Array.isArray(action)) {
        return kodi.rpc(room, command, [], callback);
    } else if (action.hasOwnProperty("type")) {
        if (action.type == "harmony") {
            if (action.hasOwnProperty("activity")) {
                if (action.status == "toggle") {
                    return harmony.toggleActivity(action.id, action.activity, callback);
                } else {
                    return harmony.runActivity(action.id, action.activity, callback);
                }
            }
            if (action.hasOwnProperty("command")) {
                return harmony.runCommand(action.id, action.device, action.command, callback);
            }
        } else if (action.type == "group") {
            return groups.setStatus(action.id, action.status, callback);
        } else {
            return callback({ error: "Unknown command type", command: command });
        }
    } else {
        return callback({error: "Unknown command", command: command});
    }

}