const Samsung = require('samsung-tv-control').default
const { KEYS } = require('samsung-tv-control/lib/keys')
const { APPS } = require('samsung-tv-control/lib/apps')


module.exports.token = function(room, callback) {
    const config = {
        debug: true, // Default: false
        ip: '192.168.1.111',
        mac: '641cb07d33b5',
        token: '55985695',
    }

    const control = new Samsung(config);

    control.isAvaliable()
        .then(() => {
            // Get token for API
            control.getToken(token => {
                callback(null, token);
            })
            control.closeConnection()
        })
        
        .catch(e => callback(e))
};

module.exports.apps = function (room, callback) {
    const config = {
        debug: true,
        ip: '192.168.1.111',
        mac: '641cb07d33b5',
        token: '55985695'
    }

    const control = new Samsung(config);

    control.turnOn()
    control.isAvaliable()
        .then(() => {
            control.getAppsFromTV((err, res) => {
                if (err) return callback(err);
                return callback(null, res);
            })
            //control.closeConnection()
        })
        .catch(e => console.error(e))
};

module.exports.volumeUp = function (callback) {
    const config = {
        debug: true,
        ip: '192.168.1.111',
        mac: '641cb07d33b5',
        token: '55985695'
    }

    const control = new Samsung(config);

    control.turnOn()
    control.isAvaliable()
        .then(() => {
            control.sendKey(KEYS.KEY_VOLUP, function (err, res) {
                if (err) return callback(err);
                return callback(null, res);
            })
            //control.closeConnection()
        })
        .catch(e => callback(e))
};

module.exports.netflix = function (room, callback) {
    const config = {
        debug: true,
        ip: '192.168.1.111',
        mac: '641cb07d33b5',
        token: '55985695',
    }

    const control = new Samsung(config);

    control.turnOn()
    control.isAvaliable()
        .then(() => {
            control.openApp(APPS.Netflix, (err, res) => {
                if (err) return callback(err);
                callback(null, res);
            })
            //control.closeConnection()
        })
        .catch(e => callback(e))
};