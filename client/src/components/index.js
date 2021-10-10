import { routes } from '../shared/constants';
import Wallets from './Wallets';
import History from './History';
import KeyManager from './KeyManager';
import Tokens from './Tokens';
import NFTs from './NFTs';
import AccountManager from './AccountManager';
import Stacking from './Stacking';

export default {
	[routes.home]: Wallets,
	[routes.dashboardpage]: Wallets,
	[routes.tokens]: Tokens,
	[routes.nfts]: NFTs,
	[routes.historypage]: History,
	[routes.keyManager]: KeyManager,
	[routes.accountManager]: AccountManager,
	[routes.stacking]: Stacking,
};
