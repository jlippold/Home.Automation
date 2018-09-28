var vm;
var base_url = "https://home.jed.bz:999/";

function isApple() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

var state = {
  search: {
    searchPhrase: "",
    roomName: "Livingroom",
    shortName: "lr",
    recentItems: [],
    results: [],
    usenet: []
  },
  cameras: {
    porch: {
      title: "Porch",
      id: "porch",
      url: "/camera/live/loadCam.aspx",
      qs: "?cam=porch",
      legacyUrl: "/camera/live/loadCam.aspx?cam=porch",
      timestamp: new Date(),
      lastCheck: new Date(),
      enabled: true,
      urls: {
        live: "#",
        motion: "#"
      }
    },
    garage: {
      title: "Garage",
      id: "garage",
      url: "/camera/live/loadCam.aspx",
      qs: "?cam=garage",
      legacyUrl: "/camera/live/loadCam.aspx?cam=garage",
      timestamp: new Date(),
      lastCheck: new Date(),
      enabled: true,
      urls: {
        live: "#",
        motion: "#"
      }
    },
    sidedoor: {
      title: "Side Door",
      id: "sidedoor",
      url: "/camera/live/loadCam.aspx",
      qs: "?cam=sidedoor",
      legacyUrl: "/camera/live/loadCam.aspx?cam=sidedoor",
      timestamp: new Date(),
      lastCheck: new Date(),
      enabled: true,
      urls: {
        live: "#",
        motion: "#"
      }
    },
    basement: {
      title: "Basement",
      id: "basement",
      url: "/camera/live/loadCam.aspx",
      qs: "?cam=basement",
      legacyUrl: "/camera/live/loadCam.aspx?cam=basement",
      timestamp: new Date(),
      lastCheck: new Date(),
      enabled: true,
      urls: {
        live: "#",
        motion: "#"
      }
    },
    generator: {
      title: "Generator",
      id: "generator",
      url: "/camera/live/loadCam.aspx",
      qs: "?cam=generator",
      legacyUrl: "/camera/live/loadCam.aspx?cam=generator",
      timestamp: new Date(),
      lastCheck: new Date(),
      enabled: true,
      urls: {
        live: "#",
        motion: "#"
      }
    },
    swings: {
      title: "Swings",
      id: "swings",
      url: "/camera/live/loadCam.aspx",
      qs: "?cam=swings",
      legacyUrl: "/camera/live/loadCam.aspx?cam=swings",
      timestamp: new Date(),
      lastCheck: new Date(),
      enabled: true,
      urls: {
        live: "#",
        motion: "#"
      }
    },
    driveway: {
      title: "Driveway",
      id: "driveway",
      url: "/camera/live/loadCam.aspx",
      qs: "?cam=driveway",
      legacyUrl: "/camera/live/loadCam.aspx?cam=driveway",
      timestamp: new Date(),
      lastCheck: new Date(),
      enabled: true,
      urls: {
        live: "#",
        motion: "#"
      }
    }
  },
  kodi: {
    bedroom: {
      title: "Bedroom TV",
      baseUrl: base_url + "kodi-br/",
      shortName: "br",
      roomName: "Bedroom",
      playerid: 0,
      item: {
        thumbnail: "",
        title: ""
      },
      percentage: 0,
      buttons: {
        on: base_url + "home/groups/br-tv/on",
        off: base_url + "home/groups/br-tv/off",
        volume_up:
          base_url +
          "home/harmony/hubs/bedroom/devices/43709373/commands/VolumeUp",
        volume_down:
          base_url +
          "home/harmony/hubs/bedroom/devices/43709373/commands/VolumeDown",
        power_toggle:
          base_url +
          "home/harmony/hubs/bedroom/devices/43709373/commands/PowerToggle"
      }
    },
    livingroom: {
      title: "Living Room TV",
      baseUrl: base_url + "kodi-lr/",
      shortName: "lr",
      roomName: "Livingroom",
      playerid: 0,
      item: {
        thumbnail: "",
        title: ""
      },
      percentage: 0,
      buttons: {
        on: base_url + "home/groups/lr-tv/on",
        off: base_url + "home/groups/lr-tv/off",
        volume_up:
          base_url +
          "home/harmony/hubs/livingroom/devices/43708749/commands/VolumeUp",
        volume_down:
          base_url +
          "home/harmony/hubs/livingroom/devices/43708749/commands/VolumeDown",
        power_toggle:
          base_url +
          "home/harmony/hubs/livingroom/devices/43708749/commands/PowerToggle"
      }
    }
  },
  insteon: {
    items: [
      {
        title: "Living Room",
        icon: "icon-sofa",
        items: []
      },
      {
        title: "Bedroom",
        icon: "icon-bedroom",
        items: []
      },
      {
        title: "Second Floor",
        icon: "icon-bedroom",
        items: []
      },
      {
        title: "Outside",
        icon: "icon-snow-heavy",
        items: []
      },
      {
        title: "Kitchen",
        icon: "icon-kitchen",
        items: []
      }
    ]
  },
  server: {
    drives: [],
    items: [
      {
        name: "CPU",
        label: "0%",
        percentage: 0.0,
        color: "green"
      },
      {
        name: "RAM",
        label: "0 GB",
        percentage: 0.0,
        color: "green"
      },
      {
        name: "Up",
        label: "30 kB/s",
        percentage: 0.1,
        color: "blue"
      },
      {
        name: "Down",
        label: "30 kB/s",
        percentage: 0.1,
        color: "blue"
      },
      {
        name: "HDD",
        label: "0 GB",
        percentage: 0.0,
        color: "green"
      }
    ]
  },
  services: {
    torrent: {
      upload: 0,
      download: 0
    },
    nzb: {
      downloadQueue: 0,
      downloadRate: 0
    },
    emby: []
  },
  icloud: {
    selectedDevice: {},
    devices: [
      {
        name: "Jed",
        status: "Old",
        loading: true,
        devices: []
      },
      {
        name: "Syn",
        status: "Old",
        loading: true,
        devices: []
      },
      {
        name: "Layla",
        status: "Old",
        loading: true,
        devices: []
      },
      {
        name: "Jetta",
        status: "Old",
        loading: true,
        devices: []
      }
    ]
  },
  commands: [
    {
      name: "FullScreen",
      type: "kodi"
    },
    {
      name: "Play/Pause",
      type: "kodi"
    }
  ]
};

var kodi_api = {
  activePlayer: {
    jsonrpc: "2.0",
    id: 0,
    method: "Player.GetActivePlayers",
    params: {}
  },
  nowPlaying: [
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
      params: ["%playerid%", ["title", "art", "thumbnail", "file"]]
    }
  ],
  searchByPath: [
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
  searchByTitle: [
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
  ],
  buttons: {
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
    Stop: {
      jsonrpc: "2.0",
      method: "Player.Stop",
      params: {
        playerid: "%playerid%"
      },
      id: 1
    }
  },
  customs: {
    "Full Screen": {
      jsonrpc: "2.0",
      method: "GUI.SetFullscreen",
      params: {
        fullscreen: "toggle"
      },
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
    }
  },
  playFileAtPath: {
    jsonrpc: "2.0",
    id: 1,
    method: "Player.Open",
    params: {
      item: {
        file: "%filename%"
      }
    }
  },
  playFolderAtPath: {
    jsonrpc: "2.0",
    id: 1,
    method: "Player.Open",
    params: {
      item: {
        directory: "%filename%"
      },
      options: {
        shuffled: true
      }
    }
  },
  playYouTube: {
    jsonrpc: "2.0",
    id: 1,
    method: "Player.Open",
    params: {
      item: {
        file: "plugin://plugin.video.youtube/play/?video_id=%videoid%"
      }
    }
  }
};


