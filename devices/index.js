module.exports = {
    hub: {
        "ip": "192.168.1.97"
    },
    insteon: require("./insteon"),
    myq: require("./myq"),
    lifx: require("./lifx"),
    kodi: require("./kodi"),
    harmony: require("./harmony"),
    thermostat: require("./ecobee"),
    groups: require("./groups"),
    sequence: require("./sequences"),
    switchmate: require("./switchmate")
};