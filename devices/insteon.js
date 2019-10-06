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
    "4F8843": {
        "description": "Driveway Sensor",
        "type": "motion",
        "icon": "icon-pitch",
        "group": "outside",
        "actions": [
            {
                "type": "push",
                "camera": "driveway",
                "cutoff": 15
            }, {
                "type": "kodi",
                "camera": "driveway",
                "cutoff": 15
            },
            {
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
        "description": "Driveway Sensor (DEAD)",
        "type": "motion",
        "icon": "icon-pitch",
        "group": "outside",
        "actions": [
        /* {
            "type": "push",
            "camera": "driveway",
            "cutoff": 15
        }, {
            "type": "kodi",
            "camera": "driveway",
            "cutoff": 15
        }, */
        {
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
        "enabled": false
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
            "insteon": "401395",
            "cutoff": 600,
            "nightOnly": true
        }],
        "enabled": true
    },
    "4A4849": {
        "description": "Kitchen Sensor",
        "type": "door",
        "icon": "icon-home",
        "group": "kitchen",
        "actions": [{
            "type": "toggle",
            "insteon": "401395",
            "cutoff": 600,
            "nightOnly": true
        }],
        "enabled": true
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
                "device": "43708749",
                "command": "PowerToggle",
                "description": "TV Toggle",
                "status": "on"
            },
            "2": {
                "type": "insteon",
                "id": "1F527C",
                "description": "fireplace",
                "status": "toggle"
            },
            "3": {
                "type": "switchmate",
                "id": "sm-living",
                "description": "Living Room",
                "status": "off"
            },
            "4": {
                "type": "switchmate",
                "id": "sm-living",
                "description": "Living Room",
                "status": "on"
            },
            "5": {
                "type": "insteon",
                "id": "3E4300",
                "description": "Dining Room",
                "status": "off"
            },
            "6": {
                "type": "group",
                "id": "kitchen",
                "description": "Kitchen Room",
                "status": "off"
            },
            "7": {
                "type": "switchmate",
                "id": "sm-dining",
                "description": "Zoo",
                "status": "off"
            },
            "8": {
                "type": "switchmate",
                "id": "sm-dining",
                "description": "Zoo",
                "status": "on"
            }
        }
    },    
    "4C0906": {
        "description": "Bedroom keypad",
        "type": "keypad",
        "enabled": true,
        "actions": {
            "3": {
                "type": "harmony",
                "id": "bedroom",
                "device": "43709373",
                "command": "PowerToggle",
                "description": "TV toggle",
                "status": "on"
            },
            "4": {
                "type": "insteon",
                "id": "3F4B99_FAN",
                "description": "Fan",
                "status": "toggle"
            },
            "5": {
                "type": "lifx",
                "id": "d073d5125481",
                "description": "Lamp",
                "status": "toggle"
            },
            "6": {
                "type": "insteon",
                "id": "1F527C",
                "description": "fireplace",
                "status": "toggle"
            }
        }
    },
    "3EBF4E": {
        "description": "Office keypad",
        "type": "keypad",
        "enabled": true,
        "actions": {
            "1": {
                "type": "harmony",
                "id": "bedroom",
                "device": "43709373",
                "command": "PowerToggle",
                "description": "TV toggle",
                "status": "on"
            },
            "2": {
                "type": "lifx",
                "id": "d073d5125481",
                "description": "Lamp",
                "status": "toggle"
            },
            "3": {
                "type": "insteon",
                "id": "3C2BBD",
                "description": "Bathroom",
                "status": "toggle"
            },
            "4": {
                "type": "lifx",
                "id": "d073d5125481",
                "description": "Lamp",
                "status": "toggle"
            },
            "5": {
                "type": "insteon",
                "id": "3F4B99_FAN",
                "description": "Fan",
                "status": "toggle"
            },
            "6": {
                "type": "switchmate",
                "id": "sm-living",
                "description": "Living Room",
                "status": "off"
            },
            "7": {
                "type": "group",
                "id": "bedroom_lights",
                "description": "bedroom",
                "status": "off"
            },
            "8": {
                "type": "group",
                "id": "kitchen",
                "description": "kitchen",
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
        "alexaNames": ["bathroom", "bathroom lights"],
        "group": "Bedroom",
        "type": "switch",
        "hasManualOverride": true,
        "enabled": true
    },
    "3E4300": {
        "description": "Dining Room",
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
        "description": "Kitchen Cabinets",
        "icon": "icon-lightbulb",
        "group": "Kitchen",
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
        "alexaNames": ["fan", "bedroom fan"],
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
        "alexaNames": ["fireplace"],
        "icon": "icon-fire",
        "group": "Living Room",
        "hasManualOverride": false,
        "type": "switch",
        "enabled": true
    },
    "237643": {
        "description": "Office Lamp",
        "alexaNames": ["office", "office light"],
        "icon": "icon-lamp",
        "group": "Second Floor",
        "hasManualOverride": true,
        "type": "switch",
        "enabled": true
    },
    "3728AC": {
        "description": "Christmas Tree", //this might the missing lamplinc
        "icon": "icon-tree",
        "alexaNames": ["tree", "christmas tree"],
        "group": "Living Room",
        "hasManualOverride": false,
        "type": "switch",
        "enabled": true
    }
};

var devices = Object.assign(motion, keypads, switches);

module.exports = devices;
