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
				use: {
					loader: 'babel-loader',
					options: {
						plugins: ['@babel/plugin-syntax-top-level-await'],
					},
				},
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
	experiments: {
		topLevelAwait: true,
	},
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			'@cd/assets': path.resolve(dir, 'src/assets'),
			'@cd/actions': path.resolve(dir, 'src/actions'),
			'@cd/helpers': path.resolve(dir, 'src/helpers'),
			'@cd/selectors': path.resolve(dir, 'src/selectors'),
			'@cd/services': path.resolve(dir, 'src/services'),
			'@cd/shared': path.resolve(dir, 'src/shared'),
			'@cd/store': path.resolve(dir, 'src/store'),
			'@cd/config': path.resolve(dir, 'src/config'),
			'@cd/constants': path.resolve(dir, 'src/constants'),
			'@cd/common': path.resolve(dir, 'src/components/Common'),
			'@cd/hooks': path.resolve(dir, 'src/components/hooks'),
			'@cd/web': path.resolve(dir, 'src/components/web'),
			'@cd/web-extension': path.resolve(dir, 'src/components/web-extension'),
			'@cd/components': path.resolve(dir, 'src/components'),
		},
		fallback: {
			stream: require.resolve('stream-browserify'),
		},
	},
});
