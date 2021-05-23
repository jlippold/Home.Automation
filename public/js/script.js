$(document).ready(function () {
  if (!localStorage.getItem('roomIndex')) {
    localStorage.setItem('roomIndex', 0);
  }
  
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
      events: function () {
        window.open("/home/motion.html#newtab").focus();
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

  var Motion = Vue.extend({
    template: "#motion-template",
    data: function () {
      return {
        data: {
          snooze: false,
          expiry: null,
          timeout: null
        }
      };
    },
    mounted: function () {
      var c = this;
      async.forever(function (next) {
        c.fetch(function () {
          setTimeout(function () {
            next();
          }, 10000);
        });
      });
    },
    
    methods: {
      silent: function() {
        var c = this;
        $.ajax({
          method: "GET",
          url: base_url + (c.data.snooze ? "home/snooze/off" : "home/snooze/30"),
          success: function (data) {
            c.fetch(function(){});
          }
        });
      },
      fetch: function (done) {
        var c = this;
        $.ajax({
          method: "GET",
          url: base_url + "home/snooze",
          success: function (data) {
            c.data.snooze = data.snooze;
            c.data.expiry = data.expiry;
            c.data.timeout = null;
            if (data.expiry) {
              var duration = moment.duration(moment(data.expiry).diff(moment()));
              c.data.timeout = Math.floor(duration.asMinutes());
            }
            done();
          },
          error: function () {
            done();
          }
        });
      }
    }
  });

  var NewKodi = Vue.extend({
    template: "#new-kodi-template",
    data: function () {
      return {
        data: {
          rooms: ["Living", "Bedroom", "Office", "Basement", "Layla", "Cora"],
          roomNames: ["Living Room", "Bedroom", "Office", "Basement", "Layla's Room", "Cora's Room"],
          roomIndex: parseInt(localStorage.getItem('roomIndex'), 10),
          playerid: -1,
          percentage: 0,
          title: null,
          type: null,
          commands: [],
          image: null
        }
      }
    },
    beforeMount: function () {
      this.fetch(function(){});
    },
    mounted: function () {
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
      browse: function() {
        window.open("jedbz:///browse#" + this.roomName()).focus(); 
      },
      setRoomByIndex: function (event, index) {
        this.data.roomIndex = index;
        localStorage.setItem("roomIndex", index);
      },
      getRoomNameByIndex: function (index) {
        return this.data.roomNames[index];
      },
      openModal: function () {
        window.open("/home/modal.html#newtab").focus();
        // $(this.$el).find("div.remoteModal1").modal("open");
      },
      openCommands: function () {
        window.open("/home/modal.html#newtab").focus();
        // $(this.$el).find("div.commandList1").modal("open");
      },
      blockModal: function (event) {
        event.stopPropagation();
        return false;
      },
      button: function (event, command) {
        if (event) event.stopPropagation();
        $.ajax({
          method: "GET",
          url: base_url + "home/televisions/" + this.roomName() + "/commands/" + command
        });
        
        return false;
      },
      fetch: function (done) {
        var v = this;
        $.ajax({
          method: "GET",
          url: base_url + "home/televisions/" + this.roomName(),
          success: function (data) {
            //console.log(data);
              v.data.title = data.title;
              v.data.image = data.image;
              v.data.type = data.type;
              v.data.percentage = data.percentage;
              v.data.commands = data.commands.splice(0);
              setTimeout(function (params) {
                done();
              }, 1500);
          },
          error: function (err) {
            setTimeout(function (params) {
              done();
            }, 3000);
          }
        });
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
      open: function (roomName) {
        var v = this;
        v.data.roomName = roomName;
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

  var Routines = Vue.extend({
    template: "#routines-template",
    data: function () {
      return {
        data: []
      };
    },
    beforeMount: function () {
      //this.fetch(function() {});
    },
    mounted: function () {
      var c = this;
      c.fetch(function () {});
    },
    methods: {
      run: function(item) {
        var message = `Press ok to confirm running ${item.actions.length} commands in this routine:`;
        item.actions.forEach(function(action) {
          message += `\n${action.description}`;
        });
        if (confirm(message)) {
          $.ajax({
            method: "GET",
            url: base_url + "home/routines/" + item.key
          });
        }
      },
      fetch: function (done) {
        var c = this;
        $.ajax({
          method: "GET",
          url: base_url + "home/routines",
          error: function () {
            done();
          },
          success: function (data) {
            c.data = data.routines.filter(function(item) {
              return item.hidden == false;
            });
            done();
          }
        });
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

  var KitchenCam = Camera.extend({
    data: function () {
      return {
        data: state.cameras.kitchen
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



  vm = new Vue({
    el: "#app",
    data: {
      showInlineModal: false
    },
    components: {
      "search-results": SearchResults,
      routines: Routines,
      insteon: Insteon,
      "new-kodi": NewKodi,
      server: Server,
      "porch-cam": PorchCam,
      "motion": Motion,
      "garage-cam": GarageCam,
      "basement-cam": BasementCam,
      "swings-cam": SwingsCam,
      "kitchen-cam": KitchenCam,
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

  socket = io.connect("https://home.jed.bz:3333/", { transports: ['websocket'], 'reconnect': false, 'connect timeout': 500 });
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

  setTimeout(() => {

    var options = {
      body: "There is movement at the " + camera,
      icon: "/camera/live/loadCam.aspx?cam=" + camera.toLowerCase()
    }

    var n = new Notification("Motion detected", options);
    n.onclick = function () {
      window.focus(); this.cancel();
    };
    setTimeout(n.close.bind(n), 5000);    

  }, 2000);


  //var audio = new Audio('/files/doorbell.mp3');
  //audio.play();
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

function volumeUp() {
  vm.$refs.newkodi.button(null, 'volumeUp');
}

function volumeDown() {
  vm.$refs.newkodi.button(null, 'volumeDown');
}

