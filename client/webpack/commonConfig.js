const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (dir) => ({
	output: {
		filename: 'static/js/[name].[contenthash:8].js',
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
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			Buffer: ['buffer', 'Buffer'],
		}),
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
		new MiniCssExtractPlugin({
			filename: 'assets/css/[name].css',
		}),
		new webpack.ProgressPlugin(),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(process.env),
		}),
	],
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			assets: path.resolve(dir, 'src/assets'),
      actions: path.resolve(dir, 'src/actions'),
      helpers: path.resolve(dir, 'src/helpers'),
      selectors: path.resolve(dir, 'src/selectors'),
      services: path.resolve(dir, 'src/services'),
      shared: path.resolve(dir, 'src/shared'),
      components: path.resolve(dir, 'src/components'),
      common: path.resolve(dir, 'src/components/common'),
      hooks: path.resolve(dir, 'src/components/hooks'),
      web: path.resolve(dir, 'src/components/web'),
      "web-extension": path.resolve(dir, 'src/components/web-extension')
		},
	},
});
