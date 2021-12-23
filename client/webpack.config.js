const { merge } = require('webpack-merge');
const { productionConfig, extensionConfig, devConfig, webConfig } = require('./webpack');

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';
	const isWeb = env.type !== 'extension';

	const evnConfig = isProduction ? productionConfig : devConfig(isWeb);
	const getTypeConfig = isWeb ? webConfig : extensionConfig;
	const typeConfig = getTypeConfig(__dirname);
	const finalConfig = merge(typeConfig, evnConfig);

	console.info(finalConfig);
	return finalConfig;
};
