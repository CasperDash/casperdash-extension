import { routes } from '../../shared/constants';
import Wallets from './Wallets';
import History from './History';
import KeyManager from './KeyManager';
import Tokens from './Tokens';
import Stake from './Stake';
import NFTs from './NFTs';
import CreateNFT from './NFTs/CreateNFTs';
import TransferNFT from './NFTs/TransferNFT';

const MODULE_MAPPING = {
	[routes.home]: Wallets,
	[routes.dashboard]: Wallets,
	[routes.tokens]: Tokens,
	[routes.history]: History,
	[routes.nfts]: NFTs,
	[routes.keyManager]: KeyManager,
	[routes.staking]: Stake,
	[routes.createnft]: CreateNFT,
	[routes.transferNft]: TransferNFT,
};

export default Object.keys(MODULE_MAPPING).reduce((out, module) => {
	return module !== 'undefined' ? { ...out, [module]: MODULE_MAPPING[module] } : out;
}, {});
