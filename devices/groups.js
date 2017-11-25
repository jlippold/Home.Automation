module.exports = {
    "livingroom": {
        "name": "Living Room",
        "icon": "icon-sofa",
        "on": [{
            "type": "insteon",
            "id": "3E4300",
            "description": "Family Room"
        }, {
            "type": "insteon",
            "id": "1F527C",
            "description": "fireplace"
        }, {
            "type": "lifx",
            "id": "d073d511ea88",
            "description": "Living Room Lamp"
        }, {
            "type": "harmony",
            "id": "livingroom",
            "activity": "25614547",
            "description": "Watch TV"
        }, {
            "type": "harmony",
            "id": "livingroom",
            "device": "43708766",
            "command": "F2"
        }],
        "off": [{
            "type": "insteon",
            "id": "3E4300",
            "description": "Family Room"
        }, {
            "type": "insteon",
            "id": "1F527C",
            "description": "fireplace"
        }, {
            "type": "lifx",
            "id": "d073d511ea88",
            "description": "Living Room Lamp"
        }, {
            "type": "harmony",
            "id": "livingroom",
            "device": "43708766",
            "command": "F1"
        }]
    },
    "livingroom_lights": {
        "name": "Living Room Lights",
        "icon": "icon-sofa",
        "on": [{
            "type": "insteon",
            "id": "401395",
            "description": "Living Room Lamp 2"
        }, {
            "type": "lifx",
            "id": "d073d511ea88",
            "description": "Living Room Lamp"
        }],
        "off": [{
            "type": "insteon",
            "id": "401395",
            "description": "Living Room Lamp 2"
        }, {
            "type": "lifx",
            "id": "d073d511ea88",
            "description": "Living Room Lamp"
        }]
    },
    "bedroom": {
        "name": "Bedroom",
        "icon": "icon-bedroom",
        "on": [{
            "type": "insteon",
            "id": "3C2BBD",
            "description": "bathroom"
        }, {
            "type": "insteon",
            "id": "3F4B99_FAN",
            "description": "ceiling fan"
        }, {
            "type": "insteon",
            "id": "3F4B99",
            "description": "ceiling light"
        }, {
            "type": "harmony",
            "id": "bedroom",
            "activity": "25625298",
            "description": "Watch TV"
        }, {
            "type": "harmony",
            "id": "bedroom",
            "device": "43709382",
            "command": "F2"
        }, {
            "type": "lifx",
            "id": "d073d5125481",
            "description": "Bedroom Lamp"
        }],
        "off": [{
            "type": "insteon",
            "id": "3C2BBD",
            "description": "bathroom"
        }, {
            "type": "insteon",
            "id": "3F4B99_FAN",
            "description": "ceiling fan"
        }, {
            "type": "insteon",
            "id": "3F4B99",
            "description": "ceiling light"
        }, {
            "type": "harmony",
            "id": "bedroom",
            "device": "43709382",
            "command": "F1"
        }, {
            "type": "lifx",
            "id": "d073d5125481",
            "description": "Bedroom Lamp"
        }]
    },
    "dining_room": {
        "name": "Dining Room",
        "icon": "icon-table",
        "on": [{
            "type": "insteon",
            "id": "237643",
            "description": "lamp"
        }, {
            "type": "lifx",
            "id": "d073d5122368",
            "description": "tall lamp"
        }, {
            "type": "lifx",
            "id": "d073d5116404",
            "description": "wall lamp"
        }],
        "off": [{
            "type": "insteon",
            "id": "237643",
            "description": "lamp"
        }, {
            "type": "lifx",
            "id": "d073d5122368",
            "description": "tall lamp"
        }, {
            "type": "lifx",
            "id": "d073d5116404",
            "description": "wall lamp"
        }]
    },
    "lr-tv": {
        "name": "Living Room TV",
        "icon": "icon-desktop",
        "on": [{
            "type": "harmony",
            "id": "livingroom",
            "activity": "25614547",
            "description": "Watch TV"
        }, {
            "type": "harmony",
            "id": "livingroom",
            "device": "43708766",
            "command": "F2"
        }],
        "off": [{
            "type": "harmony",
            "id": "livingroom",
            "device": "43708766",
            "command": "F1"
        }]
    },
    "br-tv": {
        "name": "Bed Room TV",
        "icon": "icon-desktop-1",
        "on": [{
            "type": "harmony",
            "id": "bedroom",
            "activity": "25625298",
            "description": "Watch TV"
        }, {
            "type": "harmony",
            "id": "bedroom",
            "device": "43709382",
            "command": "F2"
        }],
        "off": [{
            "type": "harmony",
            "id": "bedroom",
            "device": "43709382",
            "command": "F1"
        }]
    },
    "outside": {
        "name": "Outside",
        "icon": "icon-house",
        "on": [{
            "type": "insteon",
            "id": "1A8D98",
            "description": "outside"
        }, {
            "type": "insteon",
            "id": "40954A",
            "description": "outside"
        }, {
            "type": "insteon",
            "id": "3C2CC5",
            "description": "outside"
        }],
        "off": [{
            "type": "insteon",
            "id": "1A8D98",
            "description": "outside"
        }, {
            "type": "insteon",
            "id": "40954A",
            "description": "outside"
        }, {
            "type": "insteon",
            "id": "3C2CC5",
            "description": "outside"
        }]
    },
    "kitchen": {
        "name": "Kitchen",
        "icon": "icon-house",
        "on": [{
            "type": "insteon",
            "id": "46D72A",
            "description": "kitchen"
        }, {
            "type": "insteon",
            "id": "40A548",
            "description": "kitchen"
        }],
        "off": [{
            "type": "insteon",
            "id": "46D72A",
            "description": "kitchen"
        }, {
            "type": "insteon",
            "id": "40A548",
            "description": "kitchen"
        }]
    }
};