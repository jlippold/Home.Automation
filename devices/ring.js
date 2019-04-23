module.exports = {
    "2686950": {
        "description": "Driveway light",
        "icon": "icon-lightbulb",
        "group": "Outside",
        "type": "switch",
        "hasManualOverride": true,
        "enabled": true
    },
    "Front Door": {
        "description": "Ring Front Door",
        "type": "motion",
        "icon": "icon-home",
        "group": "outside",
        "actions": [{
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
    "Driveway": {
        "description": "Ring Driveway Sensor",
        "type": "motion",
        "icon": "icon-garage",
        "group": "outside",
        "actions": [{
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
    }
}