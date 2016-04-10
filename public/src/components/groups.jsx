'use strict'
var React = require('react');
var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var GroupStore = require('../stores/groupStore.js');
var request = require('browser-request');


module.exports = React.createClass({
	displayName: 'Groups',
	componentWillMount: function() {
		GroupStore.bind('change', this.changed);
	},
	componentWillUnmount: function() {
		GroupStore.unbind('change', this.changed);
	},
	getInitialState: function() {
        return {};
    },
	changed: function() {
		var groups = GroupStore.groups();
        this.setState({
            groups: groups
        });
	},
	componentDidMount: function() {
		var component = this;
		request(component.props.source, function(error, response, body) {
			if (error) {
				console.log(error);
			}
			AppDispatcher.dispatch({
				actionName: 'update-group-list',
				groups: JSON.parse(body)
			});
		});
	},
	render: function() {
		var groups = this.state.groups;
		var results = [];
		var component = this;
		if (groups) {
			
			Object.keys(groups).forEach(function(group)  {
				
				var icon;
				
				if (groups[group].hasOwnProperty("status") && groups[group].status == "waiting") {
					icon = "icon-spin5 animate-spin";
				} else {
					icon = groups[group].icon;
				}

				results.push(
			        <li key={group} className="list-group-item">

			          <span className="liHeader">
			          	<i className={icon} />
			          	{groups[group].name}
			          </span>
			          <div style={{float: 'right'}}>
			            <button onClick={component.runGroup.bind(null, null, group, "on")}
			            className="btn btn-success btn-lg">
				            <i className="icon-ok" />
				            On
			            </button>
			            &nbsp;
			            <button onClick={component.runGroup.bind(null, null, group, "off")}
			            className="btn btn-danger btn-lg">
			            	<i className="icon-cancel-1" />
			            	Off
			            </button>
			          </div>
			        </li>
				); 
			});
		}
		
	    return (
	      <ul className="list-group">
	      	{results}
	      </ul>
	    );
	},
	runGroup: function(event, group, status) {
			var url = this.props.source + "/" + group + "/" + status;
			
			AppDispatcher.dispatch({
				actionName: 'group-state-change',
				groupName: group,
				status: "waiting"
			});

			request(url, function(error, response, body) {
				if (error) {
					console.log(error);
				}
				setTimeout(function() {
					return AppDispatcher.dispatch({
						actionName: 'group-state-change',
						groupName: group,
						status: "ready"
					});
				}, 1000);
			});
	}
});