var vm;
var base_url = "https://jed.bz/";

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
        title: "Dining Room",
        icon: "icon-table",
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

$(document).ready(function () {

  var Camera = Vue.extend({
    template: "#camera-template",
    data: function () {
      return {
        data: {
          date: new Date().toISOString().substring(0, 10),
          dateString: moment().format("YYYY-MM-DD"),
          lastCheck: new Date(),
          url: null,
          loadingStream: false,
          base64: null,
          playing: {
            video: null,
            image: null
          },
          recordings: []
        }
      };
    },
    computed: {
      loading: {
        cache: false,
        get: function () {
          var time_diff = Math.abs(moment().diff(moment(this.data.timestamp)));
          return time_diff > 3000;
        }
      }
    },
    mounted: function () {
      $(this.$el).find("div.cameraModal").modal();
    },
    beforeMount: function () {
      var c = this;
      c.data.url = c.data.legacyUrl;
      async.forever(function (next) {
        setTimeout(function () {
          c.data.lastCheck = new Date();
          var time_diff = Math.abs(moment().diff(moment(c.data.timestamp)));
          if (time_diff > 2000) { //update using legacy methods 
            c.data.url = c.data.legacyUrl + "&r=" + Math.random();
          }
          next()
        }, 1000);
      });
    },
    methods: {
      camLoaded: function () {
        //console.log("Updated cam: " + this.data.id + " " + new Date());
        this.data.timestamp = new Date();
      },
      update: function (data) {
        if (!vm.showInlineModal) {
          this.data.url = "data:image/jpg;base64," + data;
        }
      },
      liveStream: function () {
        //add spinner in here
        var c = this;
        if (c.data.loadingStream) {
          return;
        }
        c.data.loadingStream = true;
        $.ajax({
          method: "GET",
          url: "home/cameras/live/" + c.data.id,
          success: function (data) {
            if (data && data.stream) {
              setTimeout(function () {
                c.playVideo(data.stream);
                c.data.loadingStream = false;
              }, 3000);
            }
          },
          error: function (err) {
            console.log(err);
            c.data.loadingStream = false;
          }
        });
      },
      playVideo: function (stream) {
        if (isApple()) {
          //launch native player
          var url = 'jedbz:///playVideo#' + escape(stream);
          document.location.href = url;
        } else {
          //play inline
          document.location.href = stream;
        }
        return false;
      },
      openModal: function () {
        var c = this;
        vm.showInlineModal = true;
        setTimeout(function () {
          vm.$refs.recordings.loadRecordings(c.data.id);
        }, 500);
      }
    }
  });

  var Recordings = Vue.extend({
    template: "#recording-template",
    data: function () {
      return {
        data: {
          date: new Date().toISOString().substring(0, 10),
          dateString: moment().format("YYYY-MM-DD"),
          camera: "porch",
          cameras: state.cameras,
          playing: {
            video: null,
            image: null
          },
          recordings: {}
        }
      };
    },
    computed: {
      url: function () {
        var c = this;
        return (
          c.data.cameras[c.data.camera].baseUrl +
          c.data.cameras[c.data.camera].qs +
          "&r=" + c.data.cameras[c.data.camera].timestamp.getTime().toString() +
          "&width=" + document.documentElement.clientWidth
        );
      }
    },
    watch: {
      "data.dateString": function () {
        this.refreshData();
      }
    },
    methods: {
      refreshData: function () {
        var c = this;
        c.data.recordings = [];
        $.ajax({
          method: "GET",
          url: "/home/cameras/recordings/?dateString=" + c.data.dateString,
          success: function (data) {
            if (data && data.recordings && data.recordings.length > 0) {
              var out = {};
              data.recordings.forEach(function (item) {
                if (!out.hasOwnProperty(item.time)) {
                  out[item.time] = [];
                }
                out[item.time].push(item);
              });

              c.data.recordings = out;
              setTimeout(function () {
                c.loadPictures(c.$el);
              }, 200);
            }
          },
          error: function (err) {
            console.log(err);
          }
        });
      },
      loadRecordings: function (camera) {
        var c = this;
        c.data.camera = camera;
        c.refreshData();
      },
      loadPictures: function (element) {
        $(element).find("div.recording-wrapper").unbind("scroll");
        $(element).find("div.recording-wrapper").bind("scroll", function () {
          var scroller = this;
          clearTimeout($.data(this, 'scrollTimer'));
          $.data(this, 'scrollTimer', setTimeout(function () {
            var containerLeft = $(scroller).scrollLeft();
            var containerRight = containerLeft + $(scroller).width();
            $(scroller).find("img[src='/img/loader.gif']").each(function () {
              var innerLeft = $(this).offset().left + containerLeft;
              var innerRight = innerLeft + $(this).width();
              //$(this).attr("data-containerLeft", containerLeft);
              //$(this).attr("data-containerRight", containerRight);
              //$(this).attr("data-innerLeft", innerLeft);
              //$(this).attr("data-innerRight", innerRight);

              if ((innerLeft <= containerRight) && (innerLeft >= containerLeft)) {
                //$(this).attr("data-visible", true);
                var src = $(this).attr("data-image");
                $(this).attr("src", src);
              }
            });
          }, 250))
        });
        $(element).find("div.recording-wrapper").trigger("scroll");
      },
      playVideo: function (event, recording) {

        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (iOS) {
          //launch native player
          var url = 'jedbz:///playVideo#' + escape(recording.video);
          document.location.href = url;
        } else {
          //play inline
          this.data.playing.image = recording.image;
          this.data.playing.video = recording.video;
          var player = document.getElementById("player");
          window.scrollTo(0, 0);
          player.load();
        }
        return false;
      },
      closeModal: function () {
        vm.showInlineModal = false;
      }
    }
  });

  var Weather = Vue.extend({
    template: "#weather-template",
    data: function () {
      return {
        data: {
          date: "pending",
          outdoor: {
            "temperature": "",
            "text": "",
            "high": "",
            "low": "",
            "icon": "wi-day-cloudy"
          },
          indoor: {
            "mode": "heat",
            "temperature": 65,
            "desiredHeat": 65,
            "desiredCool": 65
          },
          forecast: []
        }
      };
    },
    mounted: function () {
      this.fetch();
    },
    methods: {
      setAC: function (mode) {
        var c = this;
        mode = mode == "off" ? "mode=off" : "mode=" + mode + "&hold=true";
        $.ajax({
          method: "GET",
          url: "/climate/?" + mode,
          error: function () {
            alert("Error");
          },
          success: function (data) {
            c.fetch();
          }
        });
      },
      fetch: function () {
        var c = this;
        $.ajax({
          method: "GET",
          url: base_url + "home/services/weather",
          success: function (data) {
            c.populate(data);
          }
        });
      },
      populate: function (data) {
        var c = this;
        c.data.date = data.date;
        c.data.outdoor = data.outdoor;
        c.data.indoor = data.indoor;
        c.data.forecast = data.forecast.slice();
      }
    }
  });

  var Kodi = Vue.extend({
    template: "#kodi-template",
    data: function () {
      return {
        data: {}
      };
    },
    beforeMount: function () {
      this.fetch();
    },
    mounted: function () {
      $(this.$el).find("div.remoteModal").modal();
      $(this.$el).find("div.commandList").modal();
      var c = this;
      async.forever(function (next) {
        c.fetch(function () {
          next();
        });
      });
    },
    methods: {
      openModal: function () {
        $(this.$el).find("div.remoteModal").modal("open");
      },
      openCommands: function () {
        $(this.$el).find("div.commandList").modal("open");
      },
      search: function (event, device) {
        event.stopPropagation();
        vm.$refs.results.open(this.data.roomName, this.data.shortName);
        return false;
      },
      button: function (event, id, device) {
        event.stopPropagation();
        if (device == "kodi") {
          var url =
            this.data.baseUrl +
            "jsonrpc?request=" +
            JSON.stringify(kodi_api.buttons[id]);
          url = url.replace(/"%playerid%"/g, this.data.playerid);

          $.ajax({
            method: "GET",
            url: url
          });
        } else {
          $.ajax({
            method: "GET",
            url: device.buttons[id]
          });
        }
        return false;
      },
      runCommand: function (event, command) {
        var url =
          this.data.baseUrl + "jsonrpc?request=" + JSON.stringify(command);
        url = url.replace(/"%playerid%"/g, this.data.playerid);

        $.ajax({
          method: "GET",
          url: url
        });
        return false;
      },
      fetch: function (done) {
        var v = this;
        async.auto(
          {
            getPlayer: function (callback) {
              var url =
                v.data.baseUrl +
                "jsonrpc?request=" +
                JSON.stringify(kodi_api.activePlayer);
              $.ajax({
                method: "GET",
                url: url,
                success: function (data) {
                  if (data && data.result && data.result.length > 0) {
                    v.data.playerid = data.result[0].playerid;
                    callback(null, data.result[0].playerid);
                  } else {
                    v.data.playerid = 0;
                    callback("no player");
                  }
                },
                error: function (err) {
                  callback(err);
                }
              });
            },
            getNowPlaying: [
              "getPlayer",
              function (results, callback) {
                var url =
                  v.data.baseUrl +
                  "jsonrpc?request=" +
                  JSON.stringify(kodi_api.nowPlaying);
                var playerid = results.getPlayer;
                url = url.replace(/"%playerid%"/g, playerid);

                $.ajax({
                  method: "GET",
                  url: url,
                  error: function (err) {
                    callback(err);
                  },
                  success: function (data) {
                    if (data && Array.isArray(data) && data.length == 2) {
                      v.data.percentage = data[0].result.percentage;
                      callback(null, data[1].result.item);
                    } else {
                      console.log(v);
                      callback("nothing playing");
                    }
                  }
                });
              }
            ],
            fixUnknownType: [
              "getNowPlaying",
              function (results, callback) {
                var item = results.getNowPlaying;

                if (item.type == "unknown" && item.file && !item.title) {
                  var filename = item.file.split("/").pop();
                  var pathname = item.file
                    .substring(0, item.file.indexOf(filename) - 1)
                    .split("/")
                    .pop();
                  var url =
                    v.data.baseUrl +
                    "jsonrpc?request=" +
                    JSON.stringify(kodi_api.searchByPath);
                  var playerid = results.getPlayer;

                  url = url.replace(/%filename%/g, filename);
                  url = url.replace(/%pathname%/g, pathname);

                  $.ajax({
                    method: "GET",
                    url: url,
                    success: function (data) {
                      if (data && Array.isArray(data) && data.length == 2) {
                        if (
                          data[0].result &&
                          data[0].result.episodes &&
                          Array.isArray(data[0].result.episodes) &&
                          data[0].result.episodes.length > 0
                        ) {
                          return callback(null, data[0].result.episodes[0]);
                        } else if (
                          data[1].result &&
                          data[1].result.movies &&
                          Array.isArray(data[1].result.movies) &&
                          data[1].result.movies.length > 0
                        ) {
                          return callback(null, data[1].result.movies[0]);
                        } else {
                          return callback("nothing found");
                        }
                      } else {
                        return callback("bad call");
                      }
                    },
                    error: function (err) {
                      callback(err);
                    }
                  });
                } else {
                  callback(null, item);
                }
              }
            ],
            formatImages: [
              "fixUnknownType",
              function (results, callback) {
                var item = results.fixUnknownType;
                var images = item.art;

                //fix image paths, and set primary thumbnail
                var preferredImages = [
                  "fanart",
                  "fanart1",
                  "fanart2",
                  "clearart",
                  "clearlogo",
                  "landscape",
                  "thumb"
                ];

                item.thumbnail = null;

                preferredImages.forEach(function (key) {
                  if (images.hasOwnProperty(key)) {
                    images[key] =
                      "/kodi-img/?room=" +
                      v.data.shortName +
                      "&path=image%2F" +
                      encodeURIComponent(images[key]);
                    if (!item.thumbnail) {
                      item.thumbnail = images[key];
                    }
                  }
                });

                callback(null, item);
              }
            ]
          },
          function (err, results) {
            //if (err) {
            //console.log(err);
            //}

            //ensure required props
            var item = results.formatImages;
            if (!item) {
              item = {
                title: "",
                thumbnail: ""
              };
            }
            if (!item.title) {
              item.title = "";
            }
            if (!item.thumbnail) {
              item.thumbnail = "";
            }

            v.data.item = item;

            if (done) {
              setTimeout(function () {
                done();
              }, 5000);
            }
          }
        );
      }
    }
  });

  var NewKodi = Vue.extend({
    template: "#new-kodi-template",
    data: function () {
      return {
        data: {
          rooms: ["Livingroom", "Bedroom", "Office", "Basement"],
          roomIndex: 0,
          title: "Bedroom TV",
          baseUrl: base_url + "kodi-br/",
          shortName: "br",
          roomName: "Bedroom",
          playerid: 0,
          item: {
            thumbnail: "",
            title: ""
          },
          percentage: 0
        }
      }
    },
    beforeMount: function () {
      this.fetch();
    },
    mounted: function () {
      $(this.$el).find("div.remoteModal").modal();
      $(this.$el).find("div.commandList").modal();
      var c = this;
      async.forever(function (next) {
        c.fetch(function () {
          next();
        });
      });
    },
    methods: {
      roomName: function (params) {
        var d = this.data;
        return d.rooms[d.roomIndex];
      },
      selectRoomByIndex: function (event, index) {
        this.data.roomIndex = index;
      },
      openModal: function () {
        $(this.$el).find("div.remoteModal").modal("open");
      },
      openCommands: function () {
        $(this.$el).find("div.commandList").modal("open");
      },
      search: function (event, device) {
        event.stopPropagation();
        vm.$refs.results.open(this.data.roomName, this.data.shortName);
        return false;
      },
      button: function (event, id, device) {
        event.stopPropagation();
        if (device == "kodi") {
          var url =
            this.data.baseUrl +
            "jsonrpc?request=" +
            JSON.stringify(kodi_api.buttons[id]);
          url = url.replace(/"%playerid%"/g, this.data.playerid);

          $.ajax({
            method: "GET",
            url: url
          });
        } else {
          $.ajax({
            method: "GET",
            url: device.buttons[id]
          });
        }
        return false;
      },
      runCommand: function (event, command) {
        var url =
          this.data.baseUrl + "jsonrpc?request=" + JSON.stringify(command);
        url = url.replace(/"%playerid%"/g, this.data.playerid);

        $.ajax({
          method: "GET",
          url: url
        });
        return false;
      },
      fetch: function (done) {
        var v = this;
        async.auto(
          {
            getPlayer: function (callback) {
              var url =
                v.data.baseUrl +
                "jsonrpc?request=" +
                JSON.stringify(kodi_api.activePlayer);
              $.ajax({
                method: "GET",
                url: url,
                success: function (data) {
                  if (data && data.result && data.result.length > 0) {
                    v.data.playerid = data.result[0].playerid;
                    callback(null, data.result[0].playerid);
                  } else {
                    v.data.playerid = 0;
                    callback("no player");
                  }
                },
                error: function (err) {
                  callback(err);
                }
              });
            },
            getNowPlaying: [
              "getPlayer",
              function (results, callback) {
                var url =
                  v.data.baseUrl +
                  "jsonrpc?request=" +
                  JSON.stringify(kodi_api.nowPlaying);
                var playerid = results.getPlayer;
                url = url.replace(/"%playerid%"/g, playerid);

                $.ajax({
                  method: "GET",
                  url: url,
                  error: function (err) {
                    callback(err);
                  },
                  success: function (data) {
                    if (data && Array.isArray(data) && data.length == 2) {
                      v.data.percentage = data[0].result.percentage;
                      callback(null, data[1].result.item);
                    } else {
                      console.log(v);
                      callback("nothing playing");
                    }
                  }
                });
              }
            ],
            fixUnknownType: [
              "getNowPlaying",
              function (results, callback) {
                var item = results.getNowPlaying;

                if (item.type == "unknown" && item.file && !item.title) {
                  var filename = item.file.split("/").pop();
                  var pathname = item.file
                    .substring(0, item.file.indexOf(filename) - 1)
                    .split("/")
                    .pop();
                  var url =
                    v.data.baseUrl +
                    "jsonrpc?request=" +
                    JSON.stringify(kodi_api.searchByPath);
                  var playerid = results.getPlayer;

                  url = url.replace(/%filename%/g, filename);
                  url = url.replace(/%pathname%/g, pathname);

                  $.ajax({
                    method: "GET",
                    url: url,
                    success: function (data) {
                      if (data && Array.isArray(data) && data.length == 2) {
                        if (
                          data[0].result &&
                          data[0].result.episodes &&
                          Array.isArray(data[0].result.episodes) &&
                          data[0].result.episodes.length > 0
                        ) {
                          return callback(null, data[0].result.episodes[0]);
                        } else if (
                          data[1].result &&
                          data[1].result.movies &&
                          Array.isArray(data[1].result.movies) &&
                          data[1].result.movies.length > 0
                        ) {
                          return callback(null, data[1].result.movies[0]);
                        } else {
                          return callback("nothing found");
                        }
                      } else {
                        return callback("bad call");
                      }
                    },
                    error: function (err) {
                      callback(err);
                    }
                  });
                } else {
                  callback(null, item);
                }
              }
            ],
            formatImages: [
              "fixUnknownType",
              function (results, callback) {
                var item = results.fixUnknownType;
                var images = item.art;

                //fix image paths, and set primary thumbnail
                var preferredImages = [
                  "fanart",
                  "fanart1",
                  "fanart2",
                  "clearart",
                  "clearlogo",
                  "landscape",
                  "thumb"
                ];

                item.thumbnail = null;

                preferredImages.forEach(function (key) {
                  if (images.hasOwnProperty(key)) {
                    images[key] =
                      "/kodi-img/?room=" +
                      v.data.shortName +
                      "&path=image%2F" +
                      encodeURIComponent(images[key]);
                    if (!item.thumbnail) {
                      item.thumbnail = images[key];
                    }
                  }
                });

                callback(null, item);
              }
            ]
          },
          function (err, results) {
            //if (err) {
            //console.log(err);
            //}

            //ensure required props
            var item = results.formatImages;
            if (!item) {
              item = {
                title: "",
                thumbnail: ""
              };
            }
            if (!item.title) {
              item.title = "";
            }
            if (!item.thumbnail) {
              item.thumbnail = "";
            }

            v.data.item = item;

            if (done) {
              setTimeout(function () {
                done();
              }, 5000);
            }
          }
        );
      }
    }
  });

  var Insteon = Vue.extend({
    template: "#switchGroup-template",
    data: function () {
      return {
        data: state.insteon
      };
    },
    beforeMount: function () {
      this.fetch(function () { });
    },
    mounted: function () {
      //$(this.$el).find("div.collapsible-header:first").addClass("active");
      $(this.$el).find("ul.collapsible").collapsible();

      var c = this;

      //refresh devices
      c.refreshStatus();
      setInterval(function () {
        var lastRefresh =
          c.data.lastAPIRefresh || moment().subtract(15, "minutes");
        var now = moment();
        if (lastRefresh.add(10, "minutes").isBefore(now)) {
          c.refreshStatus();
        }
      }, 1000);

      //pull device list again
      async.forever(function (next) {
        c.fetch(function () {
          next();
        });
      });
    },
    methods: {
      toggle: function (device, status) {
        var url = base_url + "home/";
        if (status == "on") {
          url += device.onUrl;
        } else {
          url += device.offUrl;
        }

        $.ajax({
          method: "GET",
          url: url,
          success: function (data) {
            device.status = status;
          }
        });
      },
      refreshStatus: function () {
        var c = this;
        $.ajax({
          method: "GET",
          url: base_url + "home/api/refresh",
          error: function () {
            c.data.lastAPIRefresh = moment().subtract(15, "minutes");
          },
          success: function (data) {
            c.data.lastAPIRefresh = moment();
          }
        });
      },
      fetch: function (done) {
        var c = this;
        $.ajax({
          method: "GET",
          url: base_url + "home/api/status",
          error: function () {
            done();
          },
          success: function (data) {
            var component = state.insteon;
            component.items.forEach(function (item) {
              item.items = [];
            });

            var getItemGroup = function (groupName) {
              var group;
              component.items.forEach(function (item) {
                if (item.title == groupName) {
                  group = item;
                }
              });
              return group;
            };

            Object.keys(data).forEach(function (key) {
              var item = data[key];
              var parent = getItemGroup(item.group);
              if (parent && item.description.indexOf("TV") == -1) {
                parent.items.push(item);
              }
            });

            setTimeout(function () {
              done();
            }, 3000);
          }
        });
      }
    }
  });

  var SearchResults = Vue.extend({
    template: "#search-result-template",
    data: function () {
      return {
        data: state.search
      };
    },
    mounted: function () {
      $(".searchResults").modal();
      var v = this;
      setInterval(function () {
        v.fetchRecents();
      }, 60000);
      v.fetchRecents();
    },
    methods: {
      open: function (roomName, shortName) {
        var v = this;
        v.data.roomName = roomName;
        v.data.shortName = shortName;
        v.data.results = v.data.recentItems.slice();
        $("input.search").focus();
        $(".searchResults").modal("open");
      },
      doSearch: function () {
        var v = this;
        v.data.results = [];

        var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = v.data.searchPhrase.match(regExp);
        if (match && match[2].length == 11) {
          var videoid = match[2];
          var url = "/youtube/?video=" + videoid;
          $.ajax({
            method: "GET",
            url: url,
            success: function (data) {
              data.videoid = videoid;
              data.thumbnail = data.thumbnail_url;
              data.plot = data.author_name + ": " + data.title;
              data.type = "youtube";
              delete data.thumbnail_url;
              delete data.author_name;
              delete data.html;

              v.data.results.push(data);
            }
          });
        } else {
          //no youtube
          var url =
            state.kodi.livingroom.baseUrl +
            "jsonrpc?request=" +
            JSON.stringify(kodi_api.searchByTitle);
          url = url.replace(/%title%/g, v.data.searchPhrase);

          $.ajax({
            method: "GET",
            url: url,
            success: function (data) {
              if (data && Array.isArray(data) && data.length == 2) {
                var tvshows = data[0].result.tvshows;
                var movies = data[1].result.movies;

                function getThumbnail(item, shortName) {
                  var preferredImages = [
                    "thumb",
                    "fanart",
                    "fanart1",
                    "fanart2",
                    "clearart",
                    "clearlogo",
                    "landscape"
                  ];
                  item.thumbnail = null;
                  preferredImages.forEach(function (key) {
                    if (item.art.hasOwnProperty(key)) {
                      item.art[key] =
                        "/kodi-img/?room=" +
                        shortName +
                        "&path=image%2F" +
                        encodeURIComponent(item.art[key]);
                      if (!item.thumbnail) {
                        item.thumbnail = item.art[key];
                      }
                    }
                  });
                  return item;
                }

                if (movies) {
                  movies.forEach(function (movie) {
                    movie = getThumbnail(movie, v.data.shortName);
                    movie.type = "movie";
                    v.data.results.push(movie);
                  });
                }
                if (tvshows) {
                  tvshows.forEach(function (episode) {
                    episode = getThumbnail(episode, v.data.shortName);
                    episode.type = "episode";
                    v.data.results.push(episode);
                  });
                }
              } else {
                return console.log("bad search");
              }
            },
            error: function (err) {
              return console.log(err);
            }
          });
        }
      },
      fetchRecents: function (done) {
        var v = this;
        $.ajax({
          method: "GET",
          url: "/recentPlays/",
          dataType: "json",
          success: function (recent) {
            state.search.recentItems = recent.items.slice();
            if (done) {
              done(recent);
            }
          }
        });
      },
      saveRecent: function (newItem) {
        var v = this;
        v.fetchRecents(function (recent) {
          var output = {
            items: []
          };
          var max = 50;
          var i = 0;

          var found = false;
          recent.items.forEach(function (item) {
            if (i < max) {
              if (JSON.stringify(item) === JSON.stringify(newItem)) {
                //push to top
                found = true;
                output.items.unshift(newItem);
              } else {
                //save original
                output.items.push(item);
              }
            }
            i = i + 1;
          });

          if (!found) {
            output.items.unshift(newItem);
          }

          state.search.recentItems = output.items.slice();

          //save it back to the DB
          $.ajax({
            method: "POST",
            url: "/recentPlays/",
            data: "val=" + encodeURIComponent(JSON.stringify(output, null, 2))
          });
        });
      },
      play: function (item) {
        if (item.type == "movie") {
          this.playMovie(item);
        }
        if (item.type == "episode") {
          this.playShow(item);
        }
        if (item.type == "youtube") {
          this.playYouTube(item);
        }
      },
      playMovie: function (item) {
        var v = this;
        var url =
          v.data.roomName != "Livingroom"
            ? state.kodi.bedroom.baseUrl
            : state.kodi.livingroom.baseUrl;
        url =
          url + "jsonrpc?request=" + JSON.stringify(kodi_api.playFileAtPath);
        url = url.replace(/%filename%/g, item.file);

        $.ajax({
          method: "GET",
          url: url,
          success: function (data) {
            state.search.searchPhrase = "";
            $(".searchResults").modal("close");
            v.saveRecent(item);
            vm.$refs[v.data.roomName.toLowerCase()].runCommand(
              null,
              kodi_api.customs["Full Screen"]
            );
          }
        });
      },
      playShow: function (item) {
        var v = this;
        var url =
          v.data.roomName != "Livingroom"
            ? state.kodi.bedroom.baseUrl
            : state.kodi.livingroom.baseUrl;
        url =
          url + "jsonrpc?request=" + JSON.stringify(kodi_api.playFolderAtPath);
        url = url.replace(/%filename%/g, item.file);

        $.ajax({
          method: "GET",
          url: url,
          success: function (data) {
            state.search.searchPhrase = "";
            $(".searchResults").modal("close");
            v.saveRecent(item);
            vm.$refs[v.data.roomName.toLowerCase()].runCommand(
              null,
              kodi_api.customs["Full Screen"]
            );
          }
        });
      },
      playYouTube: function (item) {
        var v = this;
        var url =
          v.data.roomName != "Livingroom"
            ? state.kodi.bedroom.baseUrl
            : state.kodi.livingroom.baseUrl;
        url = url + "jsonrpc?request=" + JSON.stringify(kodi_api.playYouTube);
        url = url.replace(/%videoid%/g, item.videoid);

        $.ajax({
          method: "GET",
          url: url,
          success: function (data) {
            state.search.searchPhrase = "";
            $(".searchResults").modal("close");
            v.saveRecent(item);
            vm.$refs[v.data.roomName.toLowerCase()].runCommand(
              null,
              kodi_api.customs["Full Screen"]
            );
          }
        });
      }
    }
  });

  var Server = Vue.extend({
    template: "#server-template",
    data: function () {
      return {
        data: state.server
      };
    },
    mounted: function () {
      var c = this;
      async.forever(function (next) {
        c.fetch(function () {
          setTimeout(function () {
            next();
          }, 3000);
        });
      });
    },
    methods: {
      fetch: function (done) {
        async.parallel(
          [
            function (next) {
              $.ajax({
                method: "GET",
                url: base_url + "home/services/server",
                error: function () {
                  next();
                },
                success: function (data) {
                  var newItems = state.server.items.slice();
                  var updateOrAppend = function (newItem) {
                    newItems.forEach(function (item, idx) {
                      if (item.name == newItem.name) {
                        newItems[idx] = newItem;
                      }
                    });
                  };

                  var item = {};
                  var name = "CPU";
                  item.name = name;
                  item.percentage = data[name].percentUsed;
                  item.label = data[name].formatPercentUsed;

                  item.color = "green";
                  if (item.percentage > 0.7) {
                    item.color = "red";
                  } else if (item.percentage > 0.5) {
                    item.color = "orange";
                  }

                  updateOrAppend(item);

                  item = {};
                  name = "RAM";
                  item.name = name;
                  item.percentage = data[name].percentUsed;
                  item.label = data[name].formatUsed;

                  item.color = "green";
                  if (item.percentage > 0.9) {
                    item.color = "red";
                  } else if (item.percentage > 0.75) {
                    item.color = "orange";
                  }

                  updateOrAppend(item);

                  item = {};
                  name = "HDD";
                  item.name = name;
                  item.percentage = data[name].percentUsed;
                  item.label = data[name].formatUsed;
                  updateOrAppend(item);

                  item.color = "green";
                  if (item.percentage > 0.9) {
                    item.color = "red";
                  } else if (item.percentage > 0.65) {
                    item.color = "orange";
                  }

                  state.server.items = newItems;

                  var drives = [];
                  Object.keys(data).forEach(function (key) {
                    var item = data[key];
                    if (item.name.indexOf(":") > -1) {
                      var newItem = {
                        name: item.name,
                        percentage: item.percentUsed,
                        label: item.formatUsed,
                        color: "green"
                      };
                      if (newItem.percentage > 0.9) {
                        newItem.color = "red";
                      } else if (newItem.percentage > 0.65) {
                        newItem.color = "orange";
                      }

                      drives.push(newItem);
                    }
                  });
                  state.server.drives = drives;
                  next();
                }
              });
            },
            function (next) {
              $.ajax({
                method: "GET",
                url: base_url + "home/services/router",
                error: function () {
                  next();
                },
                success: function (data) {
                  if (!data) {
                    return next();
                  }
                  var newItems = state.server.items.slice();
                  var updateOrAppend = function (newItem) {
                    newItems.forEach(function (item, idx) {
                      if (item.name == newItem.name) {
                        newItems[idx] = newItem;
                      }
                    });
                  };

                  var item = {};
                  var name = "Up";
                  item.name = name;
                  item.percentage = data.upload.percentage;
                  item.label = data.upload.formatted.average;
                  updateOrAppend(item);

                  item.color = "blue";
                  if (item.percentage > 0.9) {
                    item.color = "red";
                  } else if (item.percentage > 0.65) {
                    item.color = "orange";
                  }

                  item = {};
                  name = "Down";
                  item.name = name;
                  item.percentage = data.download.percentage;
                  item.label = data.download.formatted.average;
                  updateOrAppend(item);

                  item.color = "blue";
                  if (item.percentage > 0.9) {
                    item.color = "red";
                  } else if (item.percentage > 0.65) {
                    item.color = "orange";
                  }

                  state.server.items = newItems;

                  next();
                }
              });
            }
          ],
          function (err, results) {
            setTimeout(function () {
              done();
            }, 200);
          }
        );
      }
    }
  });

  var Devices = Vue.extend({
    template: "#device-template",
    data: function () {
      return {
        data: state.icloud,
        map: null,
        bounds: null,
        markers: []
      };
    },
    mounted: function () {
      var t = this;
      t.map = new google.maps.Map(document.getElementById("map_canvas"), {
        center: new google.maps.LatLng(41.054318, -75.095952),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      $(".confirmAlert").modal();
      var c = this;
      $(".tabs.devices").tabs();
      async.forever(function (next) {
        c.fetch(function () {
          next();
        });
      });
    },
    methods: {
      fetch: function (done) {
        var t = this;
        $.ajax({
          method: "GET",
          url: base_url + "home/services/icloud",
          error: function () {
            next();
          },
          success: function (devices) {
            //clear list
            var people = state.icloud.devices.slice();
            people.forEach(function (person) {
              person.status = "Old";
              person.devices = [];
            });

            var timeout = 60000;

            t.bounds = new google.maps.LatLngBounds();

            t.markers.forEach(function (marker) {
              marker.setMap(null);
            });
            t.markers = [];

            devices.forEach(function (device) {
              if (device.batteryLevel <= 0.2) {
                device.batteryLevel = 0.2;
                device.color = "#f44336";
              } else {
                device.color = "#000";
              }

              device.status =
                device.duration == "1 min" ? "Home" : device.duration;

              people.forEach(function (person) {
                person.loading = false;
                if (
                  device.name.toLowerCase().indexOf(person.name.toLowerCase()) >
                  -1
                ) {
                  if (device.name.toLowerCase().indexOf("iphone") > -1) {
                    if (device.location.isOld || device.location.isInaccurate) {
                      person.status = "Old";
                      timeout = 10000;
                    } else if (device.status == "Home") {
                      person.status = "Home";
                    } else {
                      person.status = "Away";
                    }

                    var marker = new RichMarker({
                      position: new google.maps.LatLng(
                        device.location.latitude,
                        device.location.longitude
                      ),
                      map: t.map,
                      shadow: 0,
                      content:
                        '<div><img src="' +
                        device.url +
                        '" class="circle" style="height: 48px;"></div>'
                    });
                    t.markers.push(marker);
                    t.bounds.extend(marker.position);
                  }

                  person.devices.push(device);
                }
              });
            });

            state.icloud.devices = people;
            if (t.markers.length > 0) {
              t.map.fitBounds(t.bounds);
              t.map.panToBounds(t.bounds);
            }
            setTimeout(function () {
              done();
            }, timeout);
          }
        });
      },
      shouldAlert: function (device) {
        state.icloud.selectedDevice = device;
        $(".confirmAlert").modal("open");
      },
      sendAlert: function (deviceId) {
        var device = encodeURIComponent(deviceId);
        $.post(base_url + "home/services/icloud/alert", {
          device: deviceId
        });
      }
    }
  });

  var Services = Vue.extend({
    template: "#services-template",
    data: function () {
      return {
        data: state.services
      };
    },
    beforeMount: function () {
      //this.fetch(function() {});
    },
    mounted: function () {
      var c = this;
      async.forever(function (next) {
        c.fetch(function () {
          setTimeout(function () {
            next();
          }, 3000);
        });
      });
    },
    methods: {
      fetch: function (done) {
        async.series(
          [
            function (next) {
              $.ajax({
                method: "GET",
                url: base_url + "home/services/nzb",
                error: function () {
                  next();
                },
                success: function (data) {
                  data.downloadColor = "green";
                  if (data.rawDownloadRate > 3000000) {
                    data.downloadColor = "red";
                  } else if (data.rawDownloadRate > 1000000) {
                    data.downloadColor = "orange";
                  }

                  data.queueColor = "green";
                  if (data.downloadQueue > 0) {
                    data.queueColor = "red";
                  }

                  state.services.nzb = data;
                  next();
                }
              });
            },
            function (next) {
              $.ajax({
                method: "GET",
                url: base_url + "home/services/torrent",
                error: function () {
                  next();
                },
                success: function (data) {
                  data.uploadColor = "blue";
                  if (data.rawUpload > 400000) {
                    data.uploadColor = "red";
                  } else if (data.rawUpload > 100000) {
                    data.uploadColor = "orange";
                  }

                  data.downloadColor = "blue";
                  if (data.rawDownload > 3000000) {
                    data.downloadColor = "red";
                  } else if (data.rawDownload > 1000000) {
                    data.downloadColor = "orange";
                  }

                  state.services.torrent = data;
                  next();
                }
              });
            },
            function (next) {
              $.ajax({
                method: "GET",
                url: base_url + "home/services/emby",
                error: function () {
                  next();
                },
                success: function (data) {
                  state.services.emby = data;
                  next();
                }
              });
            }
          ],
          function (err, results) {
            setTimeout(function () {
              done();
            }, 3000);
          }
        );
      }
    }
  });

  //sub classed components
  var PorchCam = Camera.extend({
    data: function () {
      return {
        data: state.cameras.porch
      };
    }
  });

  var GarageCam = Camera.extend({
    data: function () {
      return {
        data: state.cameras.garage
      };
    }
  });

  var BasementCam = Camera.extend({
    data: function () {
      return {
        data: state.cameras.basement
      };
    }
  });

  var SwingsCam = Camera.extend({
    data: function () {
      return {
        data: state.cameras.swings
      };
    }
  });

  var SideDoorCam = Camera.extend({
    data: function () {
      return {
        data: state.cameras.sidedoor
      };
    }
  });

  var DrivewayCam = Camera.extend({
    data: function () {
      return {
        data: state.cameras.driveway
      };
    }
  });


  var Bedroom = Kodi.extend({
    data: function () {
      var obj = {
        data: state.kodi.bedroom
      };

      obj.data.commands = [];
      Object.keys(kodi_api.customs).forEach(function (key) {
        obj.data.commands.push({
          name: key,
          command: kodi_api.customs[key]
        });
      });
      return obj;
    }
  });

  var Livingroom = Kodi.extend({
    data: function () {
      var obj = {
        data: state.kodi.livingroom
      };

      obj.data.commands = [];
      Object.keys(kodi_api.customs).forEach(function (key) {
        obj.data.commands.push({
          name: key,
          command: kodi_api.customs[key]
        });
      });
      return obj;
    }
  });

  vm = new Vue({
    el: "#app",
    data: {
      showInlineModal: false
    },
    components: {
      "search-results": SearchResults,
      insteon: Insteon,
      "kodi-bedroom": Bedroom,
      "kodi-livingroom": Livingroom,
      "new-kodi": NewKodi,
      server: Server,
      "porch-cam": PorchCam,
      "garage-cam": GarageCam,
      "basement-cam": BasementCam,
      "swings-cam": SwingsCam,
      "sidedoor-cam": SideDoorCam,
      "driveway-cam": DrivewayCam,
      recordings: Recordings,
      services: Services,
      devices: Devices,
      weather: Weather
    }
  });

  $(".button-collapse").sideNav({
    draggable: true,
    edge: "right"
  });

  if (isApple()) {
    document.location.href = 'jedbz:///mobileRegistration';
  } else {
    $("#mainNav").show();
  }

  socketInitiate();
  notificationInitiate();

  if (window.location.href.indexOf("?snooze=") > -1) {
    var url = window.location.href;
    var minutes = url.substring(url.indexOf("?snooze="));
    snooze(minutes.replace("?snooze=", ""));
  }
});


var socket;
function socketInitiate() {

  socket = io.connect("https://jed.bz:3333/", { transports: ['websocket'], 'reconnect': false, 'connect timeout': 500 });
  var lastSocketEvent = new Date();

  socket.on('picture', function (event) {
    lastSocketEvent = new Date();
    var cam = event.camera.toLowerCase();
    var data = event.data;
    vm.$refs[cam.toLowerCase()].update(event.data);
  });

  socket.on('motion', function (event) {
    lastSocketEvent = new Date();
    var cam = event.camera.toLowerCase();
    sendCameraNotification(cam);
  });

  //connection manager
  async.forever(function (next) {
    setTimeout(function () {
      var time_diff = Math.abs(moment().diff(moment(lastSocketEvent)));
      //if no socket connection in X seconds
      //manually disconnect/reconnect the socket so that
      //it doesnt to try catch up old expired data
      if (time_diff > 15 * 1000) {
        lastSocketEvent = new Date();
        socket.io.disconnect();
        setTimeout(function () {
          socket.open();
          next();
        }, 500);
      } else {
        return next()
      }
    }, 1000);
  });

}

function notificationInitiate() {

  if (isApple()) {
    return;
  }

  if (!("Notification" in window)) {
    return console.error("This browser does not support system notifications");
  }
  else if (Notification.permission === "granted") {
    return;
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission();
  }

}

function sendCameraNotification(camera) {

  if (!("Notification" in window)) {
    return console.error("This browser does not support system notifications");
  }

  if (Notification.permission != "granted") {
    return;
  }

  var options = {
    body: "There is movement at the " + camera,
    icon: "/camera/live/loadCam.aspx?cam=" + camera.toLowerCase()
  }

  var n = new Notification("Motion detected", options);
  n.onclick = function () {
    window.focus(); this.cancel();
  };
  setTimeout(n.close.bind(n), 5000);

  var audio = new Audio('/files/doorbell.mp3');
  audio.play();
}

function isApple() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function snooze(minutes) {
  $.ajax({
    method: "POST",
    url: base_url + "home/mobile/snooze",
    data: "minutes=" + minutes,
    success: function () {
      alert("Notifications will cease for " + minutes + " minutes");
    },
    error: function (x, y, z) {
      alert("snooze failed " + x + y + z);
    }
  });
}

function setMobileToken(deviceId, deviceName) {
  if (deviceId && deviceName) {
    $.ajax({
      method: "POST",
      url: base_url + "/home/mobile/register",
      data: "deviceId=" + deviceId + "&deviceName=" + deviceName,
      success: function () {
        //alert("registered");
      },
      error: function (x, y, z) {
        //alert("Push registration failed " + x + y + z);
      }
    });
  }
}