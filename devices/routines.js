module.exports = {
    first_wake: {
        description: "Morning Lights",
        time: "6:15 AM",
        hidden: false,
        cron: "15 6 * * 1-7",
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
        }, {
            type: "insteon",
            id: "46D72A",
            status: "on",
            description: "kitchen light 2 on"
        },/* {
            type: "insteon",
            id: "1F527C",
            status: "on",
            description: "fireplace"
        }*/]
    },
    wake_up_syn: {
        description: "Bedroom TV Disney",
        time: "7:45 AM",
        hidden: false,
        //cron: "45 7 * * 1-5",
        confirm: false,
        actions: [{
            type: "kodiRemote",
            device: "Bedroom",
            command: "on",
            description: "Bedroom TV On"
        }, {
            type: "kodiChannel",
            device: "Bedroom",
            command: "playChannel",
            param: "DISN",
            description: "Bedroom TV Disney"
        }]
    },
    wake_up_kids: {
        description: "Cora TV Disney",
        time: "7:45 AM",
        hidden: false,
        //cron: "45 7 * * 1-5",
        confirm: false,
        actions: [{
            type: "kodiRemote",
            device: "Cora",
            command: "on",
            description: "Cora TV On"
        }, {
            type: "kodiChannel",
            device: "Cora",
            command: "playChannel",
            param: "DISN",
            description: "Cora TV Disney"
        }]
    },
    bye_fire: {
        description: "Bye fire",
        time: "10:30 AM",
        hidden: true,
        cron: "30 10 * * 1-7",
        confirm: false,
        actions: [/* {
            type: "insteon",
            id: "1F527C",
            status: "off",
            description: "fireplace"
        }, */{
                type: "insteon",
                id: "46D72A",
                status: "off",
                description: "kitchen light 2 off"
            }, {
                type: "insteon",
                id: "237643",
                status: "off",
                description: "office light off"
            }]
    },
    kill_tv: {
        description: "kill tv",
        time: "2:00 AM",
        hidden: true,
        cron: "0 3 * * *",
        confirm: false,
        actions: [{
            type: "kodiRemote",
            device: "Bedroom",
            command: "off",
            description: "Bedroom TV Off"
        }]
    },
    kill_cora_tv: {
        description: "kill cora tv",
        time: "10:30 PM",
        hidden: true,
        cron: "30 22 * * *",
        confirm: false,
        actions: [{
            type: "kodiRemote",
            device: "Cora",
            command: "off",
            description: "Cora TV Off"
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