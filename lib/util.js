	
exports.getHost = function () {
	if (process.env.NODE_ENV == "production") {
		return "http://192.168.1.110:3000";
	} else {
		return "http://localhost:3000/home";
	}
};
