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
        return {};
    },
	changed: function() {
		var devices = DeviceStore.devices();
        this.setState({
            devices: devices
        });
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
				}
				if (device.status == "off") {
					cssClass = "card-danger";
				}
				if (device.status == "waiting") {
					cssClass = "card-warning animate-pulse";
					icon = "icon-spin2 animate-spin";
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
			          <p>
			            {device.description}
			          </p>
						{device.status ? (
							<footer>
						        <small>
								Status: {device.status}
								</small>
							</footer>
						) : null}
			        </blockquote>
			    </div>
			);
		});


		return (<div>{cards}</div>);
	},
	toggleSwitch: function(event, device, id) {

		if (device.hasOwnProperty("toggle") && device.status != "waiting") {
			request(device.toggle, function(error, response, body) {
				if (error) {
					console.log(error);

					return AppDispatcher.dispatch({
						actionName: 'device-state-change',
						device: {
							id: id,
							status: "unknown"
						}
					});
				}
			});
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