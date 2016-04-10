var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher.js');

var devices = {};

var DeviceStore = assign({}, EventEmitter.prototype, {
	bind: function(event, callback) {
		this.on("change", callback);
	},
	unbind: function(event, callback) {
		this.removeListener("change", callback);
	},
	emitChange: function(deviceId, device) {
		this.emit("change", deviceId, device);
	},
	devices: function() {
		return devices;
	}
});

AppDispatcher.register(function(payload) {
	switch (payload.actionName) {
		case 'update-device-list':
			devices = payload.devices;
			DeviceStore.emitChange();
			break;
		case 'device-state-change':
			var deviceId = payload.device.id;

			if (devices.hasOwnProperty(deviceId)) {
				devices[deviceId].status = payload.device.status;
			}

			DeviceStore.emitChange(deviceId, devices[deviceId]);
			break;
	}
});

module.exports = DeviceStore;