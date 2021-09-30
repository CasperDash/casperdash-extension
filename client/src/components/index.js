import { routes } from '../shared/constants';
import Wallets from './Wallets';
import History from './History';
import KeyManager from './KeyManager';
import Tokens from './Tokens';

export default {
	[routes.home]: Wallets,
	[routes.dashboardpage]: Wallets,
	[routes.tokens]: Tokens,
	[routes.historypage]: History,
	[routes.keyManager]: KeyManager,
};
