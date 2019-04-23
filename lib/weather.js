var request = require('request');
var async = require('async');
var moment = require('moment');

module.exports.forecast = function (callback) {

    async.auto({
        outdoor: function (next) {
            openweather(function (err, json) {
                next(err, json);
            });
        },
        indoor: function (next) {
            home(function (err, json) {
                next(err, json);
            });
        },
    }, function (err, results) {
        if (err) {
            return callback(err);
        }

        if (!results.outdoor ||
            !results.hasOwnProperty("indoor") ||
            !results.indoor ||
            !results.indoor.hasOwnProperty("thermostatList") ||
            results.indoor.thermostatList.length !== 1) {
                return callback("Invalid json result from thermostat");
        }
        //check for prop
        var outdoor = results.outdoor.list[0];
        var indoor = results.indoor.thermostatList[0];

        var calcMode = indoor.settings.hvacMode;
        if (calcMode == "auto") {
            if (indoor.equipmentStatus && indoor.equipmentStatus.indexOf("heatPump") > -1) {
                calcMode = "autoHeat"
            }
        }


        var output = {
            date: moment().format("ddd MMM Do"),
            outdoor: {
                temperature: outdoor.main.temp,
                text: outdoor.weather.description,
                high:  outdoor.main.temp_min,
                low: outdoor.main.temp_max,
                icon: getIcon(outdoor.weather.id),
                humidity: outdoor.mains.humidity,
                wind: outdoor.wind.speed,
                sunrise: outdoor.sys.sunrise,
                sunset: outdoor.sys.sunset
            },
            indoor: {
                mode: calcMode,
                temperature: Math.round(indoor.runtime.actualTemperature/10),
                desiredHeat: Math.round(indoor.runtime.desiredHeat/10),
                desiredCool: Math.round(indoor.runtime.desiredCool/10)
            },
            forecast: []
        };
            output.forecast = results.outdoor.list.map(function (outdoor) {
            return {
                day: new Date(outdoor.dt).toLocaleDateString("en-US", { weekday: 'long' }),
                text: outdoor.weather.description,
                high: outdoor.main.temp_min,
                low: outdoor.main.temp_max,
                icon: getIcon(outdoor.weather.id),
            }
        });

        callback(err, output)
    });

}

function openweather(callback) {
    var url = "https://api.openweathermap.org/data/2.5/forecast?zip=18302,us&units=metric&appid=" + process.env.openweather;
    var options = {
        url: url,
        json: true
    };
    request(options, function (err, response, body) {
        callback(err, body);
    });
}

function home(callback) {
    var options = {
        url: "http://192.168.1.110/climate/",
        json: true
    };
    request(options, function (err, response, body) {
        callback(err, body);
    });
}

function getIcon(condid) {
    var icon = '';
    switch (condid) {
        case '0': icon = 'wi-tornado';
            break;
        case '1': icon = 'wi-storm-showers';
            break;
        case '2': icon = 'wi-tornado';
            break;
        case '3': icon = 'wi-thunderstorm';
            break;
        case '4': icon = 'wi-thunderstorm';
            break;
        case '5': icon = 'wi-snow';
            break;
        case '6': icon = 'wi-rain-mix';
            break;
        case '7': icon = 'wi-rain-mix';
            break;
        case '8': icon = 'wi-sprinkle';
            break;
        case '9': icon = 'wi-sprinkle';
            break;
        case '10': icon = 'wi-hail';
            break;
        case '11': icon = 'wi-showers';
            break;
        case '12': icon = 'wi-showers';
            break;
        case '13': icon = 'wi-snow';
            break;
        case '14': icon = 'wi-storm-showers';
            break;
        case '15': icon = 'wi-snow';
            break;
        case '16': icon = 'wi-snow';
            break;
        case '17': icon = 'wi-hail';
            break;
        case '18': icon = 'wi-hail';
            break;
        case '19': icon = 'wi-cloudy-gusts';
            break;
        case '20': icon = 'wi-fog';
            break;
        case '21': icon = 'wi-fog';
            break;
        case '22': icon = 'wi-fog';
            break;
        case '23': icon = 'wi-cloudy-gusts';
            break;
        case '24': icon = 'wi-cloudy-windy';
            break;
        case '25': icon = 'wi-thermometer';
            break;
        case '26': icon = 'wi-cloudy';
            break;
        case '27': icon = 'wi-night-cloudy';
            break;
        case '28': icon = 'wi-day-cloudy';
            break;
        case '29': icon = 'wi-night-cloudy';
            break;
        case '30': icon = 'wi-day-cloudy';
            break;
        case '31': icon = 'wi-night-clear';
            break;
        case '32': icon = 'wi-day-sunny';
            break;
        case '33': icon = 'wi-night-clear';
            break;
        case '34': icon = 'wi-day-sunny-overcast';
            break;
        case '35': icon = 'wi-hail';
            break;
        case '36': icon = 'wi-day-sunny';
            break;
        case '37': icon = 'wi-thunderstorm';
            break;
        case '38': icon = 'wi-thunderstorm';
            break;
        case '39': icon = 'wi-thunderstorm';
            break;
        case '40': icon = 'wi-storm-showers';
            break;
        case '41': icon = 'wi-snow';
            break;
        case '42': icon = 'wi-snow';
            break;
        case '43': icon = 'wi-snow';
            break;
        case '44': icon = 'wi-cloudy';
            break;
        case '45': icon = 'wi-lightning';
            break;
        case '46': icon = 'wi-snow';
            break;
        case '47': icon = 'wi-thunderstorm';
            break;
        case '3200': icon = 'wi-cloud';
            break;
        default: icon = 'wi-cloud';
            break;
    }
    return icon;
}
