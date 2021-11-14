import { NFTS } from '../store/actionTypes';

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
