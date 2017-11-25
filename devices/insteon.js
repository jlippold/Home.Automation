var motion = {
    "367FA8": {
        "description": "Front Door Motion Sensor",
        "type": "motion",
        "icon": "icon-pitch",
        "group": "outside",
        "actions": [{
            "type": "push",
            "camera": "porch",
            "cutoff": 15
        }, {
            "type": "kodi",
            "camera": "porch",
            "cutoff": 15
        }, {
            "type": "toggle",
            "insteon": "1A8D98",
            "cutoff": 600,
            "nightOnly": true
        }, {
            "type": "toggle",
            "insteon": "40954A",
            "cutoff": 600,
            "nightOnly": true
        }, {
            "type": "toggle",
            "insteon": "3C2CC5",
            "cutoff": 600,
            "nightOnly": true
        }],
        "enabled": true
    },
    "3699AE": {
        "description": "Side Door Sensor",
        "type": "motion",
        "icon": "icon-pitch",
        "group": "outside",
        "actions": [{
            "type": "push",
            "camera": "sidedoor",
            "cutoff": 15
        }, {
            "type": "kodi",
            "camera": "sidedoor",
            "cutoff": 15
        }, {
            "type": "toggle",
            "insteon": "1A8D98",
            "cutoff": 600,
            "nightOnly": true
        }, {
            "type": "toggle",
            "insteon": "3C2CC5",
            "cutoff": 600,
            "nightOnly": true
        }],
        "enabled": true
    },
    "318D55": {
        "description": "Driveway Sensor",
        "type": "motion",
        "icon": "icon-pitch",
        "group": "outside",
        "actions": [{
            "type": "push",
            "camera": "driveway",
            "cutoff": 15
        }, {
            "type": "kodi",
            "camera": "driveway",
            "cutoff": 15
        }, {
            "type": "toggle",
            "insteon": "1A8D98",
            "cutoff": 600,
            "nightOnly": true
        }, {
            "type": "toggle",
            "insteon": "3C2CC5",
            "cutoff": 600,
            "nightOnly": true
        }],
        "enabled": true
    },
    "37B015": {
        "description": "Garage Sensor",
        "type": "motion",
        "icon": "icon-pitch",
        "group": "Outside",
        "actions": [{
            "type": "push",
            "camera": "garage",
            "cutoff": 15
        }, {
            "type": "toggle",
            "insteon": "40A548",
            "nightOnly": false
        }],
        "enabled": true
    },
    "37DF79": {
        "description": "Garage Door Sensor",
        "type": "door",
        "icon": "icon-home",
        "group": "outside",
        "actions": [{
            "type": "kodi",
            "camera": "garage",
            "cutoff": 15
        }, {
            "type": "toggle",
            "insteon": "3C2CC5",
            "cutoff": 600,
            "nightOnly": true
        }, {
            "type": "toggle",
            "insteon": "3C2CC5",
            "cutoff": 600,
            "nightOnly": true
        }],
        "enabled": false
    }
};
var keypads = {
    "357531": {
        "description": "Livroom keypad",
        "type": "keypad",
        "enabled": true,
        "actions": {
            "1": {
                "type": "harmony",
                "id": "livingroom",
                "device": "43708766",
                "command": "F2",
                "description": "TV On",
                "status": "on"
            },
            "2": {
                "type": "harmony",
                "id": "livingroom",
                "device": "43708766",
                "command": "F1",
                "description": "TV off",
                "status": "on"
            },
            "3": {
                "type": "group",
                "id": "livingroom_lights",
                "description": "Living Room",
                "status": "on"
            },
            "4": {
                "type": "group",
                "id": "livingroom_lights",
                "description": "Living Room",
                "status": "off"
            },
            "5": {
                "type": "group",
                "id": "dining_room",
                "description": "Dining Room",
                "status": "on"
            },
            "6": {
                "type": "group",
                "id": "dining_room",
                "description": "Dining Room",
                "status": "off"
            },
            "7": {
                "type": "insteon",
                "id": "1F527C",
                "description": "fireplace",
                "status": "toggle"
            },
            "8": {
                "type": "group",
                "id": "bedroom",
                "description": "bedroom",
                "status": "off"
            }
        }
    },
    "3EBF4E": {
        "description": "Bedroom keypad",
        "type": "keypad",
        "enabled": true,
        "actions": {
            "1": {
                "type": "harmony",
                "id": "bedroom",
                "device": "43709382",
                "command": "F2",
                "description": "TV on",
                "status": "on"
            },
            "2": {
                "type": "harmony",
                "id": "bedroom",
                "device": "43709382",
                "command": "F1",
                "description": "TV off",
                "status": "on"
            },
            "3": {
                "type": "insteon",
                "id": "3C2BBD",
                "description": "Bathroom",
                "status": "toggle"
            },
            "4": {
                "type": "insteon",
                "id": "3F4B99_FAN",
                "description": "Ceiling Fan",
                "status": "toggle"
            },
            "5": {
                "type": "lifx",
                "id": "d073d5125481",
                "description": "Lamp",
                "status": "toggle"
            },
            "6": {
                "type": "group",
                "id": "bedroom",
                "description": "bedroom",
                "status": "off"
            },
            "7": {
                "type": "group",
                "id": "dining_room",
                "description": "Dining Room",
                "status": "off"
            },
            "8": {
                "type": "group",
                "id": "livingroom",
                "description": "Living Room",
                "status": "off"
            }
        }
    }
};
var switches = {
    "46D72A": {
        "description": "Kitchen Fan",
        "icon": "icon-table",
        "group": "Kitchen",
        "type": "switch",
        "hasManualOverride": true,
        "enabled": true
    },
    "40A548": {
        "description": "Kitchen Lights",
        "icon": "icon-food",
        "group": "Kitchen",
        "type": "switch",
        "hasManualOverride": true,
        "enabled": true
    },
    "3C2BBD": {
        "description": "Bathroom",
        "icon": "icon-bathroom",
        "group": "Bedroom",
        "type": "switch",
        "hasManualOverride": true,
        "enabled": true
    },
    "3E4300": {
        "description": "Family Room",
        "icon": "icon-lightbulb",
        "group": "Living Room",
        "type": "switch",
        "hasManualOverride": true,
        "enabled": true
    },
    "1A8D98": {
        "description": "Driveway",
        "icon": "icon-garage",
        "group": "Outside",
        "type": "switch",
        "hasManualOverride": true,
        "enabled": false
    },
    "3C2CC5": {
        "description": "Sidedoor",
        "icon": "icon-door",
        "group": "Outside",
        "type": "switch",
        "hasManualOverride": true,
        "enabled": true
    },
    "401395": {
        "description": "Lamp 2",
        "icon": "icon-lightbulb",
        "group": "Living Room",
        "type": "switch",
        "hasManualOverride": false,
        "enabled": true
    },
    "40954A": {
        "description": "Front Door",
        "icon": "icon-door2",
        "group": "Outside",
        "type": "switch",
        "hasManualOverride": true,
        "enabled": true
    },
    "3F4B99": {
        "description": "Light",
        "icon": "icon-bedroom",
        "group": "Bedroom",
        "hasManualOverride": false,
        "type": "switch",
        "enabled": true
    },
    "3F4B99_FAN": {
        "description": "Fan",
        "icon": "icon-fan",
        "group": "Bedroom",
        "hasManualOverride": false,
        "type": "fan",
        "enabled": true
    },
    "2F5595": {
        "description": "Window Lamp",
        "icon": "icon-lamp2",
        "group": "Dining Room",
        "hasManualOverride": false,
        "type": "switch",
        "enabled": false
    },
    "2998CD": {
        "description": "Small Lamp old dead bulb",
        "icon": "icon-lamp",
        "group": "Dining Room",
        "hasManualOverride": false,
        "type": "switch",
        "enabled": false
    },
    "1A8DBD": {
        "description": "Bedroom controller",
        "icon": "icon-teddy",
        "group": "Bedroom",
        "hasManualOverride": true,
        "type": "switch",
        "enabled": false
    },
    "1F527C": {
        "description": "Fireplace",
        "icon": "icon-fire",
        "group": "Living Room",
        "hasManualOverride": false,
        "type": "switch",
        "enabled": true
    },
    "237643": {
        "description": "Small Lamp Linc",
        "icon": "icon-lamp",
        "group": "Dining Room",
        "hasManualOverride": true,
        "type": "switch",
        "enabled": true
    },
    "3728AC": {
        "description": "Christmas Tree",
        "icon": "icon-tree",
        "group": "Living Room",
        "hasManualOverride": false,
        "type": "switch",
        "enabled": true
    }
};

var devices = Object.assign(motion, keypads, switches);

module.exports = devices;
