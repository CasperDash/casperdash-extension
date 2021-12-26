import APP_CONFIGS from '../../config';
import History from '../../components/web/History';
import KeyManager from '../../components/web/KeyManager';
import Tokens from '../../components/web/Tokens';
import Stake from '../../components/web/Stake';
import NFTs from '../../components/web/NFTs';
import Wallets from '../../components/web-extension/Dashboard';
import Receive from '../../components/web-extension/Receive';
import Send from '../../components/web-extension/Send';

let features;
try {
	features =
		typeof APP_CONFIGS.AVAILABLE_FEATURES === 'string'
			? JSON.parse(APP_CONFIGS.AVAILABLE_FEATURES)
			: APP_CONFIGS.AVAILABLE_FEATURES;
} catch (error) {
	features = undefined;
}

const routes = {
	// Routes in menu bar
	mainRoutes: [
		{ name: 'home', route: '/', component: Wallets },
		{ name: 'dashboard', route: '/dashboard', component: Wallets },
		{ name: 'tokens', route: '/tokens', component: Tokens },
		{ name: 'history', route: '/history', component: History },
		{ name: 'keyManager', route: '/keyManager', component: KeyManager },
		{ name: 'staking', route: '/staking', component: Stake },
		{ name: 'nfts', route: '/NFTs', component: NFTs },
	],
	// Routes which navigate from main routes
	innerRoutes: [
		{ name: 'receive', route: '/receive', component: Receive },
		{ name: 'send', route: '/send', component: Send },
	],
};
export default Object.keys(routes).reduce((out, key) => {
	return { ...out, [key]: features ? routes[key].filter((route) => features.includes(route.name)) : routes[key] };
}, {});
