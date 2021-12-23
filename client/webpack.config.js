const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const APP_DIR = path.resolve(__dirname, 'src/');

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';
	const type = env.type || 'web';

	const sourceMap = isProduction ? {} : { devtool: 'inline-source-map' };
	return {
		target: ['browserslist'],
		entry: path.resolve(__dirname, 'src/index.js'),
		output: {
			filename: 'static/js/[name].[contenthash:8].js',
			path: path.resolve(__dirname, type == 'web' ? 'build' : 'build_extension'),
			assetModuleFilename: 'assets/images/[hash][ext][query]',
			chunkFilename: 'static/js/[name].[contenthash:8].js',
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					use: ['babel-loader'],
				},
				{
					test: /\.(css|scss)$/,
					use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
				},
				{
					test: /\.html$/,
					use: ['html-loader'],
				},
				{
					test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
					type: 'asset/resource',
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(
					__dirname,
					env.type === 'web' ? '/template/index.html' : '/template/extension/popup.html',
				),
				filename: env.type === 'web' ? 'index.html' : 'popup.html',
			}),
			new webpack.ProvidePlugin({
				Buffer: ['buffer', 'Buffer'],
			}),
			new webpack.ProvidePlugin({
				process: 'process/browser',
			}),
			new MiniCssExtractPlugin({
				filename: 'assets/css/[name].css',
			}),

			new CopyWebpackPlugin({
				patterns: [
					{
						from: 'template/extension/manifest.json',
						to: path.join(__dirname, 'build_extension'),
						force: true,
					},
				],
			}),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: 'template/extension/512.png',
						to: path.join(__dirname, 'build_extension'),
						force: true,
					},
				],
			}),

			// new BundleAnalyzerPlugin(),
		],
		resolve: {
			extensions: ['.js', '.jsx'],
			alias: {
				assets: path.resolve(APP_DIR, 'assets'),
			},
		},
		optimization: isProduction
			? {
					minimize: true,
					minimizer: [
						new ESBuildMinifyPlugin({
							target: 'es2019',
							css: true,
						}),
					],
					splitChunks: {
						cacheGroups: {
							vendors: {
								test: /[\\/]node_modules[\\/]/,
								name: 'vendors',
								chunks: 'all',
							},
						},
					},
			  }
			: {},
		devServer: !isProduction
			? {
					client: {
						overlay: false,
					},
					historyApiFallback: true,
					port: 3000,
			  }
			: {},
		...sourceMap,
	};
};
