import APP_CONFIGS from '../../config';
import Stake from '../../components/web/Stake';
import NFTs from '../../components/web/NFTs';
import Wallets from '../../components/web-extension/Dashboard';
import Receive from '../../components/web-extension/Receive';
import Send from '../../components/web-extension/Send';
import Token from '../../components/web-extension/TokenInfo';
import DeployDetails from '../../components/web-extension/DeployDetails';
import { AddToken } from '../../components/web-extension/TokenInfo/AddToken';
import ConnectAccount from '../../components/web-extension/ConnectAccount';
import { AddPublicKey } from '../../components/web-extension/ConnectAccount/AddPublicKey';
import Settings from '../../components/web-extension/Settings';

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
		{ name: 'staking', route: '/staking', component: Stake },
		{ name: 'nfts', route: '/NFTs', component: NFTs },
	],
	// Routes which navigate from main routes
	innerRoutes: [
		{ name: 'receive', route: '/receive', component: Receive },
		{ name: 'send', route: '/send', component: Send },
		{ name: 'token', route: '/token', component: Token },
		{ name: 'deployDetails', route: '/deployDetails', component: DeployDetails },
		{ name: 'addToken', route: '/addToken', component: AddToken },
		{ name: 'Settings', route: '/settings', component: Settings },
	],
	// Routes which do not relate to main routes
	outerRoutes: [
		{ name: 'Connect Account', route: '/connectAccount', component: ConnectAccount },
		{ name: 'Add public key', route: '/addPublicKey', component: AddPublicKey },
	],
};
export default Object.keys(routes).reduce((out, key) => {
	return { ...out, [key]: features ? routes[key].filter((route) => features.includes(route.name)) : routes[key] };
}, {});
