'use strict'
var React = require('react');
var ReactDOM = require('react-dom');
var Cards = require('../components/cards.jsx');
var Groups = require('../components/groups.jsx');
var AppDispatcher = require('../dispatcher/AppDispatcher.js');

var host = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function(event) {
	ReactDOM.render(<Cards />, document.getElementById('cardContainer'))
	var url = host + "/groups";
	ReactDOM.render(<Groups source={url} />, document.getElementById('groupContainer'))
	listen();
});

function listen() {
	
	var socket = io.connect(host);
	socket.on('devices', function(devices) {
		AppDispatcher.dispatch({
			actionName: 'update-device-list',
			devices: devices
		});

		
	});
}