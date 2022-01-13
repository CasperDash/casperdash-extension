const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./commonConfig');

module.exports = (dir) =>
	merge(common(dir), {
		target: ['browserslist'],
		entry: path.resolve(dir, 'src/app/web/index.js'),
		output: {
			path: path.resolve(dir, 'build'),
		},
		module: {
			rules: [
				{
					test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
					type: 'asset/resource',
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(dir, '/template/index.html'),
			}),
		],
	});
