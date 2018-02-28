var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist/');
var APP_DIR = path.resolve(__dirname, 'src/js/');

var config = {
	entry: APP_DIR + '/index.jsx',
	output: {
		path: BUILD_DIR,
		filename: 'bundle.js'
		},
	devServer: {
	contentBase: "./"
		},

	resolve: {
   		modules: ['node_modules'],
   		extensions: ['.js', '.jsx']
 	},
	
	module : {
		loaders : [
			{
				test : /\.jsx?/,
				include : APP_DIR,
				loader : 'babel-loader',
				query: {
				presets: ['react', 'es2015']
				}
			},
			{ 
				test: /\.css?/, 
				loader: 'style-loader!css-loader' 
			}
		]
	}
};

module.exports = config;