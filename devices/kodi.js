var players = {
    "Living": {
        ip: "192.168.1.35",
        hostname: "livroom",
        name: "living room",
        alexaNames: ["living room tv", "living room television"],
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
                "jsonrpc": "2.0",
                "method": "Addons.ExecuteAddon",
                "params": {
                    "addonid": "script.flirc_util",
                    "params": { "command": "power_on" }
                },
                "id": 2
            },
            off: {
                "jsonrpc": "2.0",
                "method": "Addons.ExecuteAddon",
                "params": {
                    "addonid": "script.flirc_util",
                    "params": { "command": "power_off" }
                },
                "id": 2
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
    "Bedroom": {
        ip: "192.168.1.140",
        hostname: "bedroom",
        name: "bedroom",
        alexaNames: ["bedroom tv", "bedroom television"],
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
                "jsonrpc": "2.0",
                "method": "Addons.ExecuteAddon",
                "params": {
                    "addonid": "script.flirc_util",
                    "params": { "command": "power_on" }
                },
                "id": 2
            },
            off: {
                "jsonrpc": "2.0",
                "method": "Addons.ExecuteAddon",
                "params": {
                    "addonid": "script.flirc_util",
                    "params": { "command": "power_off" }
                },
                "id": 2
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
    "Basement": {
        ip: "192.168.1.41",
        name: "basement",
        alexaNames: ["basement tv", "basement television"],
        hostname: "basement"
    },
    "Office": {
        ip: "192.168.1.151",
        name: "office",
        alexaNames: ["office tv", "office television"],
        hostname: "office"
    },
    "Layla": {
        ip: "192.168.1.75",
        name: "layla",
        alexaNames: ["Laylas tv", "Laylas television"],
        hostname: "layla"
    },
    "Cora": {
        ip: "192.168.1.84",
        name: "cora",
        alexaNames: ["coras tv", "coras television"],
        hostname: "cora"
    }
};

var defaults = {
    powerToggle: [{
        "jsonrpc": "2.0",
        "method": "Addons.ExecuteAddon",
        "params": {
            "addonid": "script.flirc_util",
            "params": { "command": "power" }
        },
        "id": 2
    }, {
        jsonrpc: "2.0",
        method: "Player.Stop",
        params: {
            playerid: 0
        },
        id: 1
    }, {
        jsonrpc: "2.0",
        method: "Player.Stop",
        params: {
            playerid: 1
        },
        id: 1
    }, {
        jsonrpc: "2.0",
        method: "Player.Stop",
        params: {
            playerid: 2
        },
        id: 1
    }],
    volumeUp: {
        "jsonrpc": "2.0",
        "method": "Addons.ExecuteAddon",
        "params": {
            "addonid": "script.flirc_util",
            "params": { "command": "volume_up" }
        },
        "id": 2
    },
    volumeDown: {
        "jsonrpc": "2.0",
        "method": "Addons.ExecuteAddon",
        "params": {
            "addonid": "script.flirc_util",
            "params": { "command": "volume_down" }
        },
        "id": 2
    },
    Up: {
        jsonrpc: "2.0",
        method: "Input.Up",
        id: 1
    },
    Down: {
        jsonrpc: "2.0",
        method: "Input.Down",
        id: 1
    },
    Left: {
        jsonrpc: "2.0",
        method: "Input.Left",
        id: 1
    },
    Right: {
        jsonrpc: "2.0",
        method: "Input.Right",
        id: 1
    },
    Ok: {
        jsonrpc: "2.0",
        method: "Input.Select",
        id: 1
    },
    Back: {
        jsonrpc: "2.0",
        method: "Input.Back",
        id: 1
    },
    Stop: [{
        jsonrpc: "2.0",
        method: "Player.Stop",
        params: {
            playerid: 0
        },
        id: 1
    }, {
        jsonrpc: "2.0",
        method: "Player.Stop",
        params: {
            playerid: 1
        },
        id: 1
    }, {
        jsonrpc: "2.0",
        method: "Player.Stop",
        params: {
            playerid: 2
        },
        id: 1
    }],
    "Full Screen": {
        jsonrpc: "2.0",
        method: "GUI.SetFullscreen",
        params: {
            fullscreen: "toggle"
        },
        id: 1
    },
    Info: {
        jsonrpc: "2.0",
        method: "Input.info",
        id: 1
    },
    OSD: {
        jsonrpc: "2.0",
        method: "Input.showOSD",
        id: 1
    },
    Home: {
        jsonrpc: "2.0",
        method: "Input.Home",
        id: 1
    },
    "Page Up": {
        jsonrpc: "2.0",
        method: "input.executeaction",
        params: {
            action: "pageup"
        },
        id: 1
    },
    "Page Down": {
        jsonrpc: "2.0",
        method: "input.executeaction",
        params: {
            action: "pagedown"
        },
        id: 1
    },
    "Restart Movie": {
        jsonrpc: "2.0",
        id: "libSeek",
        method: "Player.Seek",
        params: {
            playerid: 1,
            value: 0
        }
    },
    Play: [{
        jsonrpc: "2.0",
        method: "Player.PlayPause",
        params: {
            playerid: 0,
            play: true
        },
        id: 1
    }, {
        jsonrpc: "2.0",
        method: "Player.PlayPause",
        params: {
            playerid: 1,
            play: true
        },
        id: 1
    }, {
        jsonrpc: "2.0",
        method: "Player.PlayPause",
        params: {
            playerid: 2,
            play: true
        },
        id: 1
    }],
    Pause: [{
        jsonrpc: "2.0",
        method: "Player.PlayPause",
        params: {
            playerid: 0,
            play: false
        },
        id: 1
    }, {
        jsonrpc: "2.0",
        method: "Player.PlayPause",
        params: {
            playerid: 1,
            play: false
        },
        id: 1
    }, {
        jsonrpc: "2.0",
        method: "Player.PlayPause",
        params: {
            playerid: 2,
            play: false
        },
        id: 1
    }],
    Reboot: {
        jsonrpc: "2.0",
        method: "System.Reboot",
        id: 1
    },
    /*
    "ssh Reboot": {
        "type": "ssh",
        "command": "/sbin/shutdown -r -h now"
    },
    */
    "Next Item": {
        jsonrpc: "2.0",
        method: "Player.GoTo",
        params: {
            playerid: "%playerid%",
            to: "next"
        },
        id: 1
    },
    "Previous Item": {
        jsonrpc: "2.0",
        method: "Player.GoTo",
        params: {
            playerid: "%playerid%",
            to: "previous"
        },
        id: 1
    },
    "Fast Forward x8": [{
        jsonrpc: "2.0",
        method: "Player.SetSpeed",
        params: {
            playerid: 0,
            speed: 8
        },
        id: 1
    },{
        jsonrpc: "2.0",
        method: "Player.SetSpeed",
        params: {
            playerid: 1,
            speed: 8
        },
        id: 1
    },{
        jsonrpc: "2.0",
        method: "Player.SetSpeed",
        params: {
            playerid: 2,
            speed: 8
        },
        id: 1
    }],
    "Fast Forward x32": {
        jsonrpc: "2.0",
        method: "Player.SetSpeed",
        params: {
            playerid: "%playerid%",
            speed: 32
        },
        id: 1
    },
    "Rewind x8": [{
        jsonrpc: "2.0",
        method: "Player.SetSpeed",
        params: {
            playerid: 0,
            speed: -8
        },
        id: 1
    },{
        jsonrpc: "2.0",
        method: "Player.SetSpeed",
        params: {
            playerid: 1,
            speed: -8
        },
        id: 1
    },{
        jsonrpc: "2.0",
        method: "Player.SetSpeed",
        params: {
            playerid: 2,
            speed: -8
        },
        id: 1
    }],
    "Rewind x32": {
        jsonrpc: "2.0",
        method: "Player.SetSpeed",
        params: {
            playerid: "%playerid%",
            speed: -32
        },
        id: 1
    },
    "Repeat On": {
        jsonrpc: "2.0",
        method: "Player.SetRepeat",
        params: {
            playerid: "%playerid%",
            repeat: "on"
        },
        id: 1
    },
    "Repeat Off": {
        jsonrpc: "2.0",
        method: "Player.SetRepeat",
        params: {
            playerid: "%playerid%",
            repeat: "off"
        },
        id: 1
    },
    _activePlayers: {
        jsonrpc: "2.0",
        id: 0,
        method: "Player.GetActivePlayers",
        params: {}
    },
    _nowPlaying: [
        {
            jsonrpc: "2.0",
            method: "Player.GetProperties",
            id: "%playerid%",
            params: ["%playerid%", ["percentage"]]
        },
        {
            jsonrpc: "2.0",
            method: "Player.GetItem",
            id: 2,
            params: ["%playerid%", ["title", "art", "thumbnail", "file", "showtitle"]]
        }
    ],
    _searchByPath: [
        {
            jsonrpc: "2.0",
            params: {
                filter: {
                    and: [
                        {
                            operator: "is",
                            field: "filename",
                            value: "%filename%"
                        },
                        {
                            operator: "contains",
                            field: "path",
                            value: "/%pathname%/"
                        }
                    ]
                },
                properties: ["title", "art", "thumbnail", "file"]
            },
            method: "VideoLibrary.GetEpisodes",
            id: "libTvShows"
        },
        {
            jsonrpc: "2.0",
            params: {
                filter: {
                    and: [
                        {
                            operator: "is",
                            field: "filename",
                            value: "%filename%"
                        },
                        {
                            operator: "contains",
                            field: "path",
                            value: "/%pathname%/"
                        }
                    ]
                },
                properties: ["title", "art", "thumbnail", "file"]
            },
            method: "VideoLibrary.GetMovies",
            id: "libMovies"
        }
    ],
    _play: {
        "jsonrpc": "2.0",
        "method": "Player.Open",
        "params": {
            "item": { "%type%": "%item_id%" }
        },
        "id": 1
    },
    _getLiveTV: {
        "jsonrpc": "2.0",
        "method": "PVR.GetChannels",
        "params": {
            "channelgroupid": "alltv",
            "properties": ["channelnumber", "broadcastnow"]
        },
        "id": 1
    },
    _getTVShows: {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.GetTVShows",
        "params": {
            "properties": ["year", "plot"],
            "sort": { "order": "ascending", "method": "label" }
        },
        "id": "libTvShows"
    },
    _getEpisodes: {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.GetEpisodes",
        "params": {
            "tvshowid": "%show_id%"
        },
        "id": "libEpisodes"
    },
    _getMovies: {
        "jsonrpc": "2.0",
        "method": "VideoLibrary.GetMovies",
        "params": {
            "properties": ["year", "plot"],
            "sort": { "order": "ascending", "method": "label" }
        },
        "id": "libMovies"
    },
    _searchByTitle: [
        {
            jsonrpc: "2.0",
            params: {
                filter: {
                    operator: "contains",
                    field: "title",
                    value: "%title%"
                },
                limits: {
                    start: 0,
                    end: 20
                },
                properties: ["title", "art", "thumbnail", "file", "plot"]
            },
            method: "VideoLibrary.GetTVShows",
            id: "libTvShows"
        },
        {
            jsonrpc: "2.0",
            params: {
                filter: {
                    operator: "contains",
                    field: "title",
                    value: "%title%"
                },
                limits: {
                    start: 0,
                    end: 10
                },
                properties: ["title", "art", "thumbnail", "file", "plot"]
            },
            method: "VideoLibrary.GetMovies",
            id: "libMovies"
        }
    ]
}

Object.keys(players).forEach(function (id) {
    var player = players[id];
    if (!player.hasOwnProperty("commands")) {
        player.commands = defaults;
    }

    Object.keys(defaults).forEach(function (def) {
        if (!player.commands.hasOwnProperty(def)) {
            player.commands[def] = defaults[def];
        }
    });
});

module.exports = players;