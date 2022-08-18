const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./commonConfig');

module.exports = (dir) =>
	merge(common(dir), {
		entry: {
			main: path.resolve(dir, 'src/app/web-extension/index.js'),
			'sw/service-worker': path.resolve(dir, '/src/services/ServiceWorker/serviceWorker.js'),
		},
		output: {
			path: path.resolve(dir, 'build_extension'),
		},
		module: {
			rules: [
				{
					test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
					type: 'asset/resource',
				},
				{
					test: /\.svg$/,
					use: ['@svgr/webpack'],
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(dir, 'template/extension/popup.html'),
				filename: 'popup.html',
			}),
			new HtmlWebpackPlugin({
				template: path.resolve(dir, 'template/extension/popup.html'),
				filename: 'home.html',
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
			new CopyWebpackPlugin({
				patterns: [
					{
						from: 'src/assets/image/',
						to: path.join(dir, 'build_extension/assets/images/'),
						force: true,
					},
				],
			}),
		],
	});
