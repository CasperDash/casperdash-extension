import HomeIcon from '@cd/assets/image/home-icon.svg';
import NFTIcon from '@cd/assets/image/nft-menu-icon.svg';
import StakingIcon from '@cd/assets/image/staking-icon.svg';
import MarketIcon from '@cd/assets/image/market-icon.svg';
import CreateWallet from '@cd/web-extension/CreateWallet';
import WelcomeBack from '@cd/web-extension/WelcomeBack';
import NFTs from '@cd/web-extension/NFTs';
import Wallets from '@cd/web-extension/Dashboard';
import Receive from '@cd/web-extension/Receive';
import Send from '@cd/web-extension/Send';
import TokenInfo from '@cd/web-extension/TokenInfo';
import DeployDetails from '@cd/web-extension/DeployDetails';
import { AddToken } from '@cd/web-extension/TokenInfo/AddToken';
import ConnectAccount from '@cd/web-extension/ConnectAccount';
import ConnectDevice from '@cd/web-extension/ConnectAccount/ConnectDevice';
import { AddPublicKey } from '@cd/web-extension/ConnectAccount/AddPublicKey';
import Settings from '@cd/web-extension/Settings';
import { NFTDetails } from '@cd/web-extension/NFTs/NFTDetails';
import Market from '@cd/web-extension/Market';
import Staking from '@cd/web-extension/Staking';
import { SearchValidator } from '@cd/web-extension/Common/SearchValidator';
import { Confirm } from '@cd/web-extension/Staking/Confirm';
import { Undelegate } from '@cd/web-extension/Staking/Undelegate';
import ImportWallet from '@cd/web-extension/ImportWallet';
import RecoveryPhrase from '@cd/components/web-extension/RecoveryPhrase';
import Advanced from '@cd/components/web-extension/Advanced';
import ImportAccount from '@cd/components/web-extension/Common/Account/ImportAccount';
import PrivateKey from '@cd/components/web-extension/Common/Account/PrivateKey';
import DappConnection from '@cd/components/web-extension/DappConnection';
import ConnectedSites from '@cd/components/web-extension/ConnectedSites';
import DappSignDeployRequest from '@cd/components/web-extension/DappSignDeployRequest';
import DappSignMessageRequest from '@cd/components/web-extension/DappSignMessageRequest';

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
		{ name: 'Recovery Phrase', route: '/recoveryPhrase', component: RecoveryPhrase },
		{ name: 'Advanced', route: '/advanced', component: Advanced },
		{ name: 'Import Account', route: '/importAccount', component: ImportAccount },
		{ name: 'View Private Key', route: '/viewPrivateKey', component: PrivateKey },
		{ name: 'Connected Sites', route: '/connectedSites', component: ConnectedSites },
	],
	// Routes which do not relate to main routes
	outerRoutes: [
		{ name: 'Connect Account', route: '/connectAccount', component: ConnectAccount },
		{ name: 'Add public key', route: '/addPublicKey', component: AddPublicKey },
		{ name: 'Connect Device', route: '/connectDevice', component: ConnectDevice },
		{ name: 'Manage Wallet', route: '/createWallet', component: CreateWallet },
		{ name: 'Welcome Back', route: '/welcomeBack', component: WelcomeBack },
		{ name: 'Import Wallet', route: '/importWallet', component: ImportWallet },
		{ name: 'Connect With CasperDash', route: '/dappConnect', component: DappConnection },
		{ name: 'Sign Deploy With CasperDash', route: '/dappSignDeployRequest', component: DappSignDeployRequest },
		{ name: 'Sign Message With CasperDash', route: '/dappSignMessageRequest', component: DappSignMessageRequest },
	],
};
export default Object.keys(routes).reduce((out, key) => {
	return { ...out, [key]: features ? routes[key].filter((route) => features.includes(route.name)) : routes[key] };
}, {});
