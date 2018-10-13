module.exports = {
    first_wake: {
        description: "Morning Lights",
        time: "6:15 AM",
        hidden: false,
        cron: "15 6 * * 1-5",
        confirm: false,
        actions: [{
            type: "insteon",
            id: "237643",
            status: "on",
            description: "office light on"
        }, {
            type: "insteon",
            id: "40A548",
            status: "on",
            description: "kitchen light on"
        }]
    },
    wake_up_kids: {
        description: "Wake up the kids",
        time: "7:45 AM",
        hidden: false,
        cron: "45 7 * * 1-5",
        confirm: true,
        actions: [{
            type: "kodiRemote",
            device: "Cora",
            command: "powerToggle",
            description: "Cora TV On"
        }, {
            type: "kodiRemote",
            device: "Bedroom",
            command: "on",
            description: "Bedroom TV On"
        }, {
            type: "kodiChannel",
            device: "Cora",
            command: "playChannel",
            param: "TOONHD",
            description: "Cora TV Cartoons"
        }, {
            type: "kodiChannel",
            device: "Bedroom",
            command: "playChannel",
            param: "DISN",
            description: "Bedroom TV Disney"
        }]
    },
    kids_to_bed: {
        description: "Kids to bed",
        time: "8:30 PM",
        hidden: false,
        cron: "30 20 * * *",
        confirm: true,
        actions: [{
            type: "kodiRemote",
            device: "Cora",
            command: "powerToggle",
            description: "Cora TV On"
        }, {
            type: "kodiChannel",
            device: "Cora",
            command: "playChannel",
            param: "DISN",
            description: "Cora TV Disney"
        }]
    },
    dad_in_bed: {
        description: "Dad in bed",
        time: "9:45 PM",
        hidden: false,
        cron: "45 21 * * *",
        confirm: true,
        actions: [{
            type: "kodiRemote",
            device: "Bedroom",
            command: "on",
            description: "Bedroom TV On"
        }, {
            type: "kodiChannel",
            device: "Bedroom",
            command: "playChannel",
            param: "CNNHD",
            description: "Bedroom TV CNN"
        }, {
            type: "insteon",
            id: "3F4B99",
            status: "off",
            description: "bedroom light off"
        }, {
            type: "insteon",
            id: "3C2BBD",
            status: "off",
            description: "bathroom off"
        }, {
            type: "insteon",
            id: "3F4B99_FAN",
            status: "on",
            description: "fan on"
        }]
    },
    test: {
        description: "Test bed",
        hidden: true,
        time: "XX",
        //cron: "*/1 * * * *",
        confirm: true,
        actions: [{
            type: "insteon",
            id: "3F4B99",
            status: "toggle",
            description: "bedroom light toggle"
        }]
    },
    test2: {
        description: "Test office",
        hidden: true,
        time: "XX",
        //cron: "*/1 * * * *",
        confirm: true,
        actions: [{
            type: "insteon",
            id: "237643",
            status: "toggle",
            description: "office light toggle"
        }, {
            type: "kodiRemote",
            device: "Office",
            command: "on",
            description: "Office TV On"
        }, {
            type: "kodiChannel",
            device: "Office",
            command: "playChannel",
            param: "CNNHD",
            description: "Office TV CNN"
        }]
    },
};