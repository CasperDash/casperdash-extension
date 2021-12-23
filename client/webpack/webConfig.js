const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./commonConfig');

module.exports = (dir) =>
	merge(common(dir), {
		target: ['browserslist'],
		entry: path.resolve(dir, 'src/index.js'),
		output: {
			path: path.resolve(dir, 'build'),
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(dir, '/template/index.html'),
			}),
		],
	});
