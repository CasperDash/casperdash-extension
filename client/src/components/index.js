import { routes } from '../shared/constants';
import Wallets from './Wallets';
import History from './History';
import Tokens from './Tokens';
import NFTs from './NFTs';

const MODULE_MAPPING = {
	[routes.home]: Wallets,
	[routes.dashboard]: Wallets,
	[routes.tokens]: Tokens,
	[routes.history]: History,
	[routes.nfts]: NFTs,
};

export default Object.keys(MODULE_MAPPING).reduce((out, module) => {
	return module !== 'undefined' ? { ...out, [module]: MODULE_MAPPING[module] } : out;
}, {});
