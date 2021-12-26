module.exports = (isWeb) =>
	isWeb
		? {
				devServer: {
					client: {
						overlay: false,
					},
					historyApiFallback: true,
					port: 3000,
				},
		  }
		: {
				output: {
					filename: 'static/js/[name].js',
					assetModuleFilename: 'assets/images/[name][ext][query]',
					chunkFilename: 'static/js/[name].js',
				},
				devtool: 'inline-source-map',
		  };
