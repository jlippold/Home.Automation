
$(document).ready(function () {


  var Commands = Vue.extend({
    template: "#command-template",
    data: function () {
      return {
        data: {
          rooms: ["Living", "Bedroom", "Office", "Gym", "Layla", "Cora"],
          roomNames: ["Living Room", "Bedroom", "Office", "Basement", "Layla's Room", "Cora's Room"],
          roomIndex: parseInt(localStorage.getItem('roomIndex'), 10),
          commands: []
        }
      }
    },
    beforeMount: function () {
        this.fetch(function () {});
    },
    mounted: function () {},
    methods: {
      roomName: function (params) {
        var d = this.data;
        return d.rooms[d.roomIndex];
      },
      getRoomNameByIndex: function (index) {
        return this.data.roomNames[index];
      },
      button: function (event, command) {
        
        $.ajax({
          method: "GET",
          url: base_url + "home/televisions/" + this.roomName() + "/commands/" + command
        });
        if (event) { return event.stopPropagation() };
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

  vm = new Vue({
    el: "#app",
    data: {
      
    },
    components: {
      "commands": Commands,
    }
  });

});

