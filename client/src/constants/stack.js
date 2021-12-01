import APP_CONFIGS from '../config';

export const contractHashes = {
	auction: Uint8Array.from(Buffer.from(APP_CONFIGS.AUCTION_HASH, 'hex')),
};
