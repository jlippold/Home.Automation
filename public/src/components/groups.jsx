'use strict'
var React = require('react');
var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var DeviceStore = require('../stores/deviceStore.js');
var request = require('browser-request');


module.exports = React.createClass({
	displayName: 'Groups',
	getInitialState: function() {
		return {
			groups: {}
		};
	},
	componentDidMount: function() {
		var component = this;
		request(component.props.source, function(error, response, body) {
			if (error) {
				console.log(error);
			}
			component.setState({
				groups: JSON.parse(body)
			});
		});
	},
	render: function() {
		var groups = this.state.groups;
		var results = [];

		Object.keys(groups).forEach(function(group)  {
			results.push(
		        <li key={group} className="list-group-item">
		          <span className="liHeader">{groups[group].name}</span>
		          <div style={{float: 'right'}}>
		            <button className="btn btn-success btn-lg">On</button>
		            &nbsp;
		            <button className="btn btn-danger btn-lg">Off</button>
		          </div>
		        </li>
			); 
		});
		
	    return (
	      <ul className="list-group">
	      	{results}
	      </ul>
	    );
	}
});