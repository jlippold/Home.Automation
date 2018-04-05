module.exports.runAlexaAction = runAlexaAction;

var spawn = require('child_process').spawn;
var api = require("../api/");
var lib = require("../lib/");

function runAlexaAction(deviceType, status, callback) {
    var currentAlexa;
    var bash = spawn("bash.exe", ["-c", 'bash ~/alexa_remote_control.sh -lastalexa'], { cwd: "C:\\Windows\\Sysnative", windowsHide: true });

    bash.stdout.on('data', function (data) {
        currentAlexa = data.toString();
        bash.kill();
    });

    bash.on('close', function (code) {
        currentAlexa = currentAlexa.replace(/(\r\n\t|\n|\r\t)/gm, "").trim();
    
        var deviceMap = getDeviceMap();
        var action = deviceMap.find(function(d) {
            if (d.alexas.indexOf(currentAlexa) > -1) {
                if (d.devices.hasOwnProperty(deviceType)) {
                    return d;
                }
            }
        });

        if (action) {
               return action.devices[deviceType](currentAlexa, status, callback);
        } else {
            console.error("Error finding device", currentAlexa, deviceType, status);
            return callback("Unknown Room");
        }
    });

}

function getDeviceMap() {
    var calls = [
        {
            alexas: ["Bedroom", "Bathroom"],
            devices: {
                TV: function(device, status, callback) {
                    lib.groups.setStatus("br-tv", status, callback)
                }
            }
        },
        {
            alexas: ["Bedroom"],
            devices: {
                Light: function (device, status, callback) {
                     lib.groups.setStatus("bedroom_lights", status, callback)
                }
            }
        },
        {
            alexas: ["Bathroom"],
            devices: {
                Light: function (device, status, callback) {
                    api.insteon.setStatusOfDevice("3C2BBD", status, callback)
                }
            }
        },
        {
            alexas: ["Living Room", "Dining Room", "Kitchen"],
            devices: {
                TV: function (device, status, callback) {
                    lib.groups.setStatus("lr-tv", status, callback)
                }
            }
        },
        {
            alexas: ["Office", "Layla", "Basement"],
            devices: {
                TV: function (device, status, callback) {
                    device = device == "Basement" ? "Gym" : device;
                    api.kodi.execute(device, "powerToggle", callback) 
                }
            }
        },
        {
            alexas: ["Living Room"],
            devices: {
                Light: function (device, status, callback) {
                    lib.groups.setStatus("livingroom_lights", status, callback)
                }
            }
        },
        {
            alexas: ["Dining Room"],
            devices: {
                Light: function (device, status, callback) {
                    lib.groups.setStatus("dining_room", status, callback)
                }
            }
        },
        {
            alexas: ["Kitchen"],
            devices: {
                Light: function (device, status, callback) {
                    lib.groups.setStatus("kitchen", status, callback)
                }
            }
        }
    ];


    calls.forEach(function (call) {
        if (call.devices.hasOwnProperty("TV")) {

            call.devices.CNN = function (device, status, callback) {
                device = device == "Basement" ? "Gym" : device;
                lib.kodi.play(device, "channelid", 5, callback);
            };

            call.devices.Disney = function (device, status, callback) {
                device = device == "Basement" ? "Gym" : device;
                lib.kodi.play(device, "channelid", 28, callback);
            };
            /*
            call.devices["Kids Movie"] = function (device, status, callback) {
            call.devices["Movie"] = function (device, status, callback) {
            call.devices["FGTV"] = function (device, status, callback) {
            */
        }
    });
    return calls;
    
}