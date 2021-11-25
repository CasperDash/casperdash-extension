import { NFTS } from '../store/actionTypes';

/**
 * @param {Array} tokenAddressList
 * @param {string} publicKey
 * @returns
 */
export const fetchNFTInfo = (tokenAddressList, publicKey) => ({
	type: NFTS.FETCH_NFTS_INFO,
	request: {
		url: '/nfts/getNFTsInfo',
		params: {
			publicKey,
			tokenAddress: tokenAddressList,
		},
	},
});
