import APP_CONFIGS from '../config';
import History from '../components/web/History';
import KeyManager from '../components/web/KeyManager';
import Tokens from '../components/web/Tokens';
import Stake from '../components/web/Stake';
import NFTs from '../components/web/NFTs';
import Wallets from '../components/web-extension/Dashboard';

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
	staking: '/staking',
	nfts: '/NFTs',
};

const routes = features
	? Object.keys(defaultRoutes).reduce((out, route) => {
			return features.includes(route) ? { ...out, [route]: defaultRoutes[route] } : out;
	  }, {})
	: defaultRoutes;

const MODULE_MAPPING = {
	[routes.home]: Wallets,
	[routes.dashboard]: Wallets,
	[routes.tokens]: Tokens,
	[routes.history]: History,
	[routes.nfts]: NFTs,
	[routes.keyManager]: KeyManager,
	[routes.staking]: Stake,
};

export default Object.keys(MODULE_MAPPING).reduce((out, module) => {
	return module !== 'undefined' ? { ...out, [module]: MODULE_MAPPING[module] } : out;
}, {});
