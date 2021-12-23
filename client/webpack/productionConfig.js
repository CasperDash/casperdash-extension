const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = {
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
	devtool: 'inline-source-map',
};
