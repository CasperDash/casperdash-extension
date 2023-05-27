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
	staking: '/staking',
	nfts: '/NFTs',
	createnft: '/create-nft',
	dappConnect: '/dappConnect',
	dappSignDeployRequest: '/dappSignDeployRequest',
};

export const routes = features
	? Object.keys(defaultRoutes).reduce((out, route) => {
			return features.includes(route) ? { ...out, [route]: defaultRoutes[route] } : out;
	  }, {})
	: defaultRoutes;

/**
 * This variable should hold any env variables passing from .env files
 */
export const CONSTANTS = {
	DEBUG_ENV: Boolean(process.env.REACT_APP_DEBUG_ENV === 'true'),
};
