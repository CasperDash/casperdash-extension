const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./commonConfig');

module.exports = (dir) =>
	merge(common(dir), {
		entry: path.resolve(dir, 'src/app/web-extension/index.js'),
		output: {
			path: path.resolve(dir, 'build_extension'),
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(dir, '/template/extension/popup.html'),
				filename: 'popup.html',
			}),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: 'template/extension/manifest.json',
						to: path.join(dir, 'build_extension'),
						force: true,
					},
				],
			}),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: 'template/extension/512.png',
						to: path.join(dir, 'build_extension'),
						force: true,
					},
				],
			}),
		],
	});
