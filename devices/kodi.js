module.exports = {
    "livingRoom": {
        "ip": "192.168.1.99",
        "location": "livingroom",
        commands: {
            powerToggle: {
                "type": "harmony",
                "id": "livingroom",
                "device": "43708749",
                "command": "PowerToggle",
                "description": "PowerToggle",
                "status": "on"
            },
            on: {
                "type": "group",
                "id": "lr-tv",
                "description": "Living Room TV",
                "status": "on"
            },
            off: {
                "type": "group",
                "id": "lr-tv",
                "description": "Living Room TV",
                "status": "off"
            },
            volumeUp: {
                "type": "harmony",
                "id": "livingroom",
                "device": "43708749",
                "command": "VolumeUp",
                "description": "VolumeUp",
                "status": "on"
            },
            volumeDown: {
                "type": "harmony",
                "id": "livingroom",
                "device": "43708749",
                "command": "VolumeDown",
                "description": "VolumeDown",
                "status": "on"
            }
        }
    },
    "bedroom": {
        "ip": "192.168.1.98",
        "location": "bedroom",
        commands: {
            powerToggle: {
                "type": "harmony",
                "id": "bedroom",
                "device": "43709373",
                "command": "PowerToggle",
                "description": "PowerToggle",
                "status": "on"
            },
            on: {
                "type": "group",
                "id": "br-tv",
                "description": "Bedroom TV",
                "status": "on"
            },
            off: {
                "type": "group",
                "id": "br-tv",
                "description": "Bedroom TV",
                "status": "off"
            },
            volumeUp: {
                "type": "harmony",
                "id": "bedroom",
                "device": "43709373",
                "command": "VolumeUp",
                "description": "VolumeUp",
                "status": "on"
            },
            volumeDown: {
                "type": "harmony",
                "id": "bedroom",
                "device": "43709373",
                "command": "VolumeDown",
                "description": "VolumeDown",
                "status": "on"
            }
        },
    },
    "basement": {
        "ip": "192.168.1.23",
        "location": "basement"
    },
    "office": {
        "ip": "192.168.1.75",
        "location": "office"
    }
};