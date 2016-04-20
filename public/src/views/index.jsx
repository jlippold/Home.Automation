var React = require('react');
var ReactDOM = require('react-dom');
var Cards = require('../components/cards.jsx');
var Groups = require('../components/groups.jsx');
var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var request = require('browser-request');

module.exports.listen = function(host, path) {

	ReactDOM.render(<Cards />, document.getElementById('cardContainer'))
	ReactDOM.render(<Groups host={host + path} />, document.getElementById('groupContainer'))

	request(host + path + "api/refresh", function(error, response, body) {
		if (error) {
			console.log(error);
		}
	});

	var socket = io.connect(host);
	socket.on('devices', function(devices) {
		AppDispatcher.dispatch({
			actionName: 'update-device-list',
			devices: devices
		});
	});

	socket.on('device', function(device) {
		AppDispatcher.dispatch({
			actionName: 'device-state-change',
			device: device
		});
	});
}