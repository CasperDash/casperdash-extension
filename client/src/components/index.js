import { routes } from '../shared/constants';
import Wallets from './Wallets';
import History from './History';
import KeyManager from './KeyManager';

export default {
	[routes.home]: Wallets,
	[routes.dashboardpage]: Wallets,
	[routes.historypage]: History,
	[routes.keyManager]: KeyManager,
};
