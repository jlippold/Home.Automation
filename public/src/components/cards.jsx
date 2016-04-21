'use strict'
var React = require('react');
var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var DeviceStore = require('../stores/deviceStore.js');
var request = require('browser-request');

module.exports = React.createClass({
	displayName: 'Cards',
	componentWillMount: function() {
		DeviceStore.bind('change', this.changed);
	},
	componentWillUnmount: function() {
		DeviceStore.unbind('change', this.changed);
	},
	getInitialState: function() {
		var devices = DeviceStore.devices();
		return {

		};
	},
	changed: function(deviceId, device) {
		var devices = this.state.devices;

		if (!devices) {
			devices = DeviceStore.devices();
			this.setState({
				devices: devices
			});
		} else {

			if (devices && devices.hasOwnProperty(deviceId)) {
				devices[deviceId] = device;
				this.setState({
					devices: devices
				});
			}
		}

	},
	render: function() {

		if (!this.state.hasOwnProperty("devices")) {
			return (<div></div>);
		}

		var devices = this.state.devices;
		var cards = [];
		var component = this;

		Object.keys(devices).forEach(function(key) {
			var device = devices[key];
			var cssClass = "card-info";
			var icon = device.icon;

			if (device.status) {
				if (device.status == "on") {
					cssClass = "card-success";
				} else if (device.status == "off") {
					cssClass = "card-danger";
				} else if (device.status == "waiting") {
					cssClass = "card-warning animate-pulse";
					icon = "icon-spin5 animate-spin";
				} else if (device.status == "offline") {
					cssClass = "card-default";
					icon = "icon-cancel-1";
				}
			} else {
				cssClass = "card-primary";
			}

			cssClass = "card card-block card-inverse text-xs-center " + cssClass;

			cards.push(
				<div key={key} 
					className={cssClass}
					 onClick={component.toggleSwitch.bind(null, null, device, key)}
				>
			        <blockquote className="card-blockquote">
			          <i className={icon} />

						{device.manufacturer != "ecobee" || device.status == "off" ? (
							<div>
								<p>
									{device.description}
								</p>
								<footer>
								    <small>
									Status: {device.status}
									</small>
								</footer>
							</div>
						) : (
							<div>
								<div className="temp">
						        	{device.description}
						        	&nbsp;-&nbsp;
						        	<strong>{device.current.temperature}° </strong>
						        </div>
								<footer>
							        <small>
										low: {device.current.low}°
										high: {device.current.high}°
									</small>
								</footer>
							</div>
						)}
			        </blockquote>
			    </div>
			);
		});


		return (<div>{cards}</div>);
	},
	toggleSwitch: function(event, device, id) {

		if (device.hasOwnProperty("toggle") && ["on", "off"].indexOf(device.status) > -1) {
			console.log(device.toggle);
			request(device.toggle, function(error, response, body) {
				if (error) {
					console.log(error);

					return AppDispatcher.dispatch({
						actionName: 'device-state-change',
						device: {
							id: id,
							status: "offline"
						}
					});
				}
			});
		} else {
			return;
		}

		AppDispatcher.dispatch({
			actionName: 'device-state-change',
			device: {
				id: id,
				status: "waiting"
			}
		});
	}
});