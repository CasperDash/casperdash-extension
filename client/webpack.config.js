const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');

const APP_DIR = path.resolve(__dirname, 'src/');

module.exports = {
	entry: path.resolve(__dirname, 'src/index.js'),
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: './',
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
		// new ExtractTextPlugin('styles/app.css'),
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
			filename: '[name].css',
		}),
	],
	resolve: {
		extensions: ['', '.js', '.jsx'],
		alias: {
			assets: path.resolve(APP_DIR, 'assets'),
		},
	},
	optimization: {
		minimize: true,
		minimizer: [new CSSMinimizerPlugin()],
	},
};
