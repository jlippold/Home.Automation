var players = {
    "Living": {
        ip: "192.168.1.35",
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
    "Bedroom": {
        ip: "192.168.1.98",
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
    "Gym": {
        ip: "192.168.1.83"
    },
    "Office": {
        ip: "192.168.1.151"
    },
    "Layla": {
        ip: "192.168.1.75"
    }
};

var defaults = {
    powerToggle: {
        "jsonrpc": "2.0",
        "method": "Addons.ExecuteAddon",
        "params": {
            "addonid": "script.flirc_util",
            "params": { "command": "power" }
        },
        "id": 2
    },
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
    Play: {
        jsonrpc: "2.0",
        method: "Player.PlayPause",
        params: {
            playerid: "%playerid%",
            play: true
        },
        id: 1
    },
    Pause: {
        jsonrpc: "2.0",
        method: "Player.PlayPause",
        params: {
            playerid: "%playerid%",
            play: false
        },
        id: 1
    },
    Reboot: {
        jsonrpc: "2.0",
        method: "System.Reboot",
        id: 1
    },
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
    "Fast Forward x8": {
        jsonrpc: "2.0",
        method: "Player.SetSpeed",
        params: {
            playerid: "%playerid%",
            speed: 8
        },
        id: 1
    },
    "Fast Forward x32": {
        jsonrpc: "2.0",
        method: "Player.SetSpeed",
        params: {
            playerid: "%playerid%",
            speed: 32
        },
        id: 1
    },
    "Rewind x8": {
        jsonrpc: "2.0",
        method: "Player.SetSpeed",
        params: {
            playerid: "%playerid%",
            speed: -8
        },
        id: 1
    },
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