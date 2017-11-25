module.exports = {
    "heat": {
        "method": "get",
        "icon": "icon-hot",
        "description": "Heater",
        "group": "House",
        "address": "http://192.168.1.110/climate/",
        "on": "mode=heat&hold=true",
        "off": "mode=off",
        "location": "house",
        "enabled": true
    },
    "cool": {
        "method": "get",
        "icon": "icon-cold",
        "description": "Air Conditioner",
        "group": "House",
        "address": "http://192.168.1.110/climate/",
        "on": "mode=cool&hold=true",
        "off": "mode=off",
        "location": "house",
        "enabled": true
    }
}