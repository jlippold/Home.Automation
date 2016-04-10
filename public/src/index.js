document.addEventListener("DOMContentLoaded", function(event) {
	
	var host = window.location.origin;

	if (host.indexOf("localhost:8080") > -1) {
		host = "http://localhost:3000";
	}

	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = host + "/socket.io/socket.io.js";
	s.onload = function() {
		var r = require('./views/index.jsx').listen(host);
	}

	document.body.appendChild(s);
});