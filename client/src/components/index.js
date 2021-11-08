import { routes } from '../shared/constants';
import Wallets from './Wallets';
import History from './History';
import KeyManager from './KeyManager';
import Tokens from './Tokens';

const MODULE_MAPPING = {
	[routes.home]: Wallets,
	[routes.dashboard]: Wallets,
	[routes.tokens]: Tokens,
	[routes.history]: History,
	[routes.keyManager]: KeyManager,
};

export default Object.keys(MODULE_MAPPING).reduce((out, module) => {
	return module !== 'undefined' ? { ...out, [module]: MODULE_MAPPING[module] } : out;
}, {});
