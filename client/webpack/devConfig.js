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
				devtool: 'cheap-module-source-map',
		  };
