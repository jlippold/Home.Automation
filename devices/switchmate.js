module.exports = {
    "sm-office": {
        "description": "Office",
        "icon": "icon-lightbulb",
        "group": "Second Floor",
        "type": "switch",
        "hasManualOverride": true,
        "toggle": {
            "onUrl": "http://192.168.1.75:3000/office/on",
            "offUrl": "http://192.168.1.75:3000/office/off"
        },
        "enabled": true
    },
    "sm-jetta": {
        "description": "Jettas Room",
        "icon": "icon-lightbulb",
        "group": "Second Floor",
        "type": "switch",
        "hasManualOverride": true,
        "toggle": {
            "onUrl": "http://192.168.1.75:3000/jetta/on",
            "offUrl": "http://192.168.1.75:3000/jetta/off"
        },
        "enabled": true,
        "alexaNames": ["jetta", "jettas light"]
    },
    "sm-cora": {
        "description": "Coras Room",
        "icon": "icon-lightbulb",
        "group": "Second Floor",
        "type": "switch",
        "hasManualOverride": true,
        "toggle": {
            "onUrl": "http://192.168.1.75:3000/cora/on",
            "offUrl": "http://192.168.1.75:3000/cora/off"
        },
        "enabled": true,
        "alexaNames": ["cora", "coras light"]
    },
    "sm-closet": {
        "description": "Coras Closet",
        "icon": "icon-lightbulb",
        "group": "Second Floor",
        "type": "switch",
        "hasManualOverride": true,
        "toggle": {
            "onUrl": "http://192.168.1.75:3000/closet/on",
            "offUrl": "http://192.168.1.75:3000/closet/off"
        },
        "enabled": true,
        "alexaNames": ["coras closet", "coras closet light"]
    },
    "sm-dining": {
        "description": "Zoo Lights",
        "icon": "icon-lightbulb",
        "group": "Living Room",
        "type": "switch",
        "hasManualOverride": true,
        "toggle": {
            "onUrl": "http://192.168.1.75:3000/dining/on",
            "offUrl": "http://192.168.1.75:3000/dining/off"
        },
        "enabled": true,
        "alexaNames": ["Zoo light", "Zoo lights"]
    },
    "sm-living": {
        "description": "Living Room",
        "icon": "icon-lightbulb",
        "group": "Living Room",
        "type": "switch",
        "hasManualOverride": true,
        "toggle": {
            "onUrl": "http://192.168.1.75:3000/living/on",
            "offUrl": "http://192.168.1.75:3000/living/off"
        },
        "enabled": true,
        "alexaNames": ["living room", "living room light"]
    }
}