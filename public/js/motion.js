$(document).ready(function () {

  var Recordings = Vue.extend({
    template: "#recordings-template",
    data: function () {
      return {
        data: {
          index: 0,
          eventIndex: 0,
          currentDay: "",
          events: {}
        }
      }
    },
    beforeMount: function () {
      this.fetch(function () {});
    },
    mounted: function () {},
    computed: {
      currentEventVideo: function() {
        var v = this;
        var currentEvent = null;
        if (v.data.events.hasOwnProperty(v.data.currentDay)) {
          currentEvent =  v.todaysEvents[v.data.eventIndex];
        }

        if (currentEvent) {
          var video = document.getElementById("video");
          if (video) {
            
            video.pause();
            video.load();
            video.play();

            $(window).scrollTop(0);
          }
          setTimeout(function() { updateImages(); }, 500);
          
          return "/stream/gif/" + v.data.currentDay + "/" + currentEvent.filename + ".mp4";
        } else {
          return null;
        }
      },
      currentEvent: function() {
        var v = this;
        if (v.data.events.hasOwnProperty(v.data.currentDay)) {
          
          return v.todaysEvents[v.data.eventIndex];
        } else {
          return null;
        }
      },
      todaysEvents: function() {
        var v = this;
        if (v.data.events.hasOwnProperty(v.data.currentDay)) {
          
          return this.data.events[this.data.currentDay].sort(function(a,b) {
            return (a.timestamp > b.timestamp) ? -1 : ((b.timestamp > a.timestamp) ? 1 : 0)
           });
        } else {
          return [];
        }
      },
    },
    methods: {
      getCaption: function(event) {
        return moment(event.timestamp, "YYYY-MM-DD-HH-mm-ss.SSS").format("hh:mm A");
      },
      getHeader: function(event) {
        return moment(event.timestamp, "YYYY-MM-DD-HH-mm-ss.SSS").format("ddd, MMM Do [at] hh:mm A");
      },
      getHeaderForDay: function(event) {
        return moment(event.timestamp, "YYYY-MM-DD-HH-mm-ss.SSS").format("ddd, MMM Do YYYY");
      },
      previousDayLabel: function() {
        var v = this;
        var currentDay = v.data.currentDay;
        var all = v.data.events.days;
        if (!currentDay) {
          return null;
        }
        
        var idx = all.indexOf(currentDay);
        if (idx > 0) {
          return moment(all[idx - 1], "YYYY-MM-DD").format("ddd, MMM Do");
        } else {
          return null;
        } 
      },
      previousDay: function(event) {
        var v = this;
        var currentDay = v.data.currentDay;
        var all = v.data.events.days;
        if (!currentDay) {
          return null;
        }
        
        var idx = all.indexOf(currentDay);
        if (idx > 0) {
          v.data.currentDay = all[idx - 1];
        } 
      },
      nextDayLabel: function() {
        var v = this;
        var currentDay = v.data.currentDay;
        var all = v.data.events.days;
        if (!currentDay) {
          return null;
        }
        
        var idx = all.indexOf(currentDay);
        if (idx > -1 && (idx+1) < all.length) {
          return moment(all[idx + 1], "YYYY-MM-DD").format("ddd, MMM Do");
        }
      },
      nextDay: function(event) {
        var v = this;
        var currentDay = v.data.currentDay;
        var all = v.data.events.days;
        if (!currentDay) {
          return null;
        }
        
        var idx = all.indexOf(currentDay);
        if (idx > -1 && (idx+1) < all.length) {
          v.data.currentDay = all[idx + 1]
        } else {
          return null;
        } 
      },
      previousEvent: function(event) {

      },
      nextEvent: function(event) {

      },
      fetch: function (done) {
        var v = this;
        $.ajax({
          method: "GET",
          url: base_url + "home/cameras/recordings/",
          success: function (data) {
              v.data.events = data.events;
              
              if (data.events.days.length > 0) {
                v.data.currentDay = data.events.days[ data.events.days.length - 1];
                v.data.index = 0;
                v.data.eventIndex = 0;
              }

              setTimeout(function (params) {
                updateImages();
                done();
              }, 100);
          },
          error: function (err) {
            setTimeout(function (params) {
              done();
            }, 100);
          }
        });
      }
    }
  });

  vm = new Vue({
    el: "#app",
    data: {
      
    },
    components: {
      "recordings": Recordings,
    }
  });

  
});

$.fn.scrollEnd = function(callback, timeout) {          
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};

$(window).scrollEnd(function(){
    updateImages();
}, 500);

function updateImages() {
  $("img.camImage").each(function() {
    if (elementInViewport($(this).get(0)) && $(this).attr("src").indexOf("cam-placeholder") > -1) {
      $(this).attr("src", $(this).attr("data-src"));
    }
  });
}

function elementInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
  );
}
