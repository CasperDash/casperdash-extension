import { routes } from '../shared/constants';
import Wallets from './Wallets';
import History from './History';
import KeyManager from './KeyManager';
import Tokens from './Tokens';
<<<<<<< HEAD
import Stake from './Stake';
=======
import NFTs from './NFTs';
>>>>>>> 20d8437760f420a6aaa2a0b399bf84e0d3483eea

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
