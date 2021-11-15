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
<<<<<<< HEAD
	staking: '/staking',
=======
	nfts: '/NFTs',
>>>>>>> 20d8437760f420a6aaa2a0b399bf84e0d3483eea
};

export const routes = features
	? Object.keys(defaultRoutes).reduce((out, route) => {
			return features.includes(route) ? { ...out, [route]: defaultRoutes[route] } : out;
	  }, {})
	: defaultRoutes;
