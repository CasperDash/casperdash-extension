import HomeIcon from 'assets/image/home-icon.svg';
import NFTIcon from 'assets/image/nft-menu-icon.svg';
import StakingIcon from 'assets/image/staking-icon.svg';
import MarketIcon from 'assets/image/market-icon.svg';
import CreateWallet from "web-extension/CreateWallet";
import WelcomeBack from "web-extension/WelcomeBack";
import NFTs from '../../components/web-extension/NFTs';
import Wallets from '../../components/web-extension/Dashboard';
import Receive from '../../components/web-extension/Receive';
import Send from '../../components/web-extension/Send';
import TokenInfo from '../../components/web-extension/TokenInfo';
import DeployDetails from '../../components/web-extension/DeployDetails';
import { AddToken } from '../../components/web-extension/TokenInfo/AddToken';
import ConnectAccount from '../../components/web-extension/ConnectAccount';
import ConnectDevice from '../../components/web-extension/ConnectAccount/ConnectDevice';
import { AddPublicKey } from '../../components/web-extension/ConnectAccount/AddPublicKey';
import Settings from '../../components/web-extension/Settings';
import { NFTDetails } from '../../components/web-extension/NFTs/NFTDetails';
import Market from '../../components/web-extension/Market';
import Staking from '../../components/web-extension/Staking';
import { SearchValidator } from '../../components/web-extension/Common/SearchValidator';
import { Confirm } from '../../components/web-extension/Staking/Confirm';
import { Undelegate } from '../../components/web-extension/Staking/Undelegate';

let features;

const routes = {
	// Routes in menu bar
	mainRoutes: [
		{ name: 'Home', route: '/', component: Wallets, icon: HomeIcon },
		{ name: 'Staking', route: '/staking', component: Staking, icon: StakingIcon },
		{ name: 'My NFTs', route: '/NFTs', component: NFTs, icon: NFTIcon },
		{ name: 'Market', route: '/market', component: Market, icon: MarketIcon },
	],
	// Routes which navigate from main routes
	innerRoutes: [
		{ name: 'receive', route: '/receive', component: Receive },
		{ name: 'send', route: '/send', component: Send },
		{ name: 'token', route: '/token', component: TokenInfo },
		{ name: 'deployDetails', route: '/deployDetails', component: DeployDetails },
		{ name: 'addToken', route: '/addToken', component: AddToken },
		{ name: 'Settings', route: '/settings', component: Settings },
		{ name: 'NFT Details', route: '/nftDetails', component: NFTDetails },
		{ name: 'Search Validator', route: '/searchValidator', component: SearchValidator },
		{ name: 'Confirm', route: '/stakeConfirm', component: Confirm },
		{ name: 'Undelegate', route: '/undelegate', component: Undelegate },
	],
	// Routes which do not relate to main routes
	outerRoutes: [
		{ name: 'Connect Account', route: '/connectAccount', component: ConnectAccount },
		{ name: 'Add public key', route: '/addPublicKey', component: AddPublicKey },
		{ name: 'Connect Device', route: '/connectDevice', component: ConnectDevice },
    { name: 'Manage Wallet', route: '/createWallet', component: CreateWallet },
    { name: 'Welcome Back', route: '/welcomeBack', component: WelcomeBack }
	]
};
export default Object.keys(routes).reduce((out, key) => {
	return { ...out, [key]: features ? routes[key].filter((route) => features.includes(route.name)) : routes[key] };
}, {});
