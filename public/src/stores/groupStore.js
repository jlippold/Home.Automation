var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher.js');

var groups;

var GroupStore = assign({}, EventEmitter.prototype, {
	bind: function(event, callback) {
		this.on("change", callback);
	},
	unbind: function(event, callback) {
		this.removeListener("change", callback);
	},
	emitChange: function() {
		this.emit("change");
	},
	groups: function() {
		return groups;
	}
});

AppDispatcher.register(function(payload) {
	switch (payload.actionName) {
		case 'update-group-list':
			groups = payload.groups;
			GroupStore.emitChange();
			break;
		case 'group-state-change':
			groups[payload.groupName].icon = payload.icon;
			GroupStore.emitChange();
			break;
	}
});

module.exports = GroupStore;