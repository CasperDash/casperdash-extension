const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { ESBuildMinifyPlugin } = require('esbuild-loader');

const APP_DIR = path.resolve(__dirname, 'src/');

module.exports = {
	target: ['browserslist'],
	entry: path.resolve(__dirname, 'src/index.js'),
	output: {
		filename: 'static/js/[name].[contenthash:8].js',
		path: path.resolve(__dirname, 'dist'),
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
			template: './template/index.html',
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
		new BundleAnalyzerPlugin(),
	],
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			assets: path.resolve(APP_DIR, 'assets'),
		},
	},
	optimization: {
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
	},
};
