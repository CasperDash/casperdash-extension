import APP_CONFIGS from '../config';

let features;
try {
	features =
		typeof APP_CONFIGS.AVAILABLE_FEATURES === 'string'
			? JSON.parse(APP_CONFIGS.AVAILABLE_FEATURES)
			: APP_CONFIGS.AVAILABLE_FEATURES;
} catch (error) {
	features = undefined;
}

const defaultRoutes = {
	home: '/',
	dashboard: '/dashboard',
	tokens: '/tokens',
	history: '/history',
	keyManager: '/keyManager',
	nfts: '/NFTs',
};

export const routes = features
	? Object.keys(defaultRoutes).reduce((out, route) => {
			return features.includes(route) ? { ...out, [route]: defaultRoutes[route] } : out;
	  }, {})
	: defaultRoutes;
