import { NFTS } from '../store/actionTypes';

/**
 * @param {string} publicKey
 * @returns {object}
 */
export const fetchNFTInfo = (publicKey) => ({
	type: NFTS.FETCH_NFTS_INFO,
	request: {
		url: '/nfts/getNFTsInfo',
		params: {
			publicKey,
		},
	},
});
