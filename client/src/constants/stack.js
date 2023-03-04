import { getConfigKey } from '@cd/services/configurationServices';
import APP_CONFIGS from '../config';

export const getStakeAuctionHash = (network) => {
	return {
		auction: Uint8Array.from(
			Buffer.from(getConfigKey('STAKE_AUCTION_HASH', network) || APP_CONFIGS.AUCTION_HASH, 'hex'),
		),
	};
};
