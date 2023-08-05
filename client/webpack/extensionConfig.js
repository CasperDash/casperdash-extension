const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./commonConfig');
const WebpackExtensionPlugin = require('./plugins/webpackExtension');

module.exports = (dir) =>
	merge(common(dir), {
		entry: {
			popup: path.resolve(dir, 'src/app/web-extension/index.js'),
			'sw/service-worker': path.resolve(dir, 'src/services/ServiceWorker/serviceWorker.js'),
			'scripts/content/content': path.resolve(dir, 'src/content/content.js'),
			'scripts/content/inpage': path.resolve(dir, 'src/content/inpage.js'),
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
				chunks: ['popup'],
				cache: false,
			}),
			new HtmlWebpackPlugin({
				template: path.resolve(dir, 'template/extension/popup.html'),
				filename: 'home.html',
				chunks: ['popup'],
				cache: false,
			}),
			new WebpackExtensionPlugin({
				basePath: './template/extension/manifest/base.json',
				chromePath: './template/extension/manifest/chrome.json',
				firefoxPath: './template/extension/manifest/firefox.json',
				destPath: './build_extension/manifest.json',
			}),
			// new CopyWebpackPlugin({
			// 	patterns: [
			// 		{
			// 			from: 'template/extension/manifest.json',
			// 			to: path.join(dir, 'build_extension'),
			// 			force: true,
			// 		},
			// 	],
			// }),
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
		// optimization: {
		// 	splitChunks: {
		// 		cacheGroups: {
		// 			vendors: {
		// 				test: /[\\/]node_modules[\\/]/,
		// 				name: 'vendors',
		// 				chunks: 'all',
		// 			},
		// 		},
		// 	},
		// },
	});
