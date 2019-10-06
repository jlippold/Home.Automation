var request = require('request');
var apiKey = process.env.embyAPI;

module.exports.getImage = getImage;

function getImage(title, callback) {
    var options = {
        url: `https://home.jed.bz:8888/emby/Items?searchTerm=${title}&IncludeItemTypes=Series,Movie&Recursive=true&api_key=${apiKey}`,
        method: 'GET',
        json: true
    }

    request(options, function(err, res, body) {
        if (err) return callback(err);
        var id;
        if (body.hasOwnProperty("Items")) {
            if (Array.isArray(body.Items) && body.Items.length > 0) {
                id = body.Items[0].Id;
            }
        }
        if (id) {
            return callback(null, `https://home.jed.bz:8888/emby/Items/${id}/Images/logo?width=300`);
        }
        return callback("cant find item");
    });
}