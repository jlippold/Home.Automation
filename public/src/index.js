document.addEventListener("DOMContentLoaded", function(event) {
	
	var origin = window.location.origin;
	var path = "/home/"

	if (origin.indexOf("localhost:8080") > -1) {
		origin = "http://localhost:3000";
	}

	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = origin + "/socket.io/socket.io.js";
	s.onload = function() {
		var r = require('./views/index.jsx').listen(origin, path);
	}

	document.body.appendChild(s);
});