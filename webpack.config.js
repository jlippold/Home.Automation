module.exports = {
	entry: "./public/src/index.js",
	output: {
		path: __dirname,
		filename: "./public/js/bundle.js"
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				presets: ['react']
			}
		}]
	}
};