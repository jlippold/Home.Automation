var pool = [];
var isDraining = false;

setInterval(drainPool, 250);

module.exports.add = add;

function drainPool() {
	if (pool.length > 0 && !isDraining) {
		isDraining = true;
		pool.shift()(); //run the func
		setTimeout(function() {
			isDraining = false;
		}, 250);
	}
}

function add(obj) {
	pool.push(obj);
}

