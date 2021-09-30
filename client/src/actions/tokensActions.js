import { TOKENS } from '../store/actionTypes';

export const fetchTokensInfo = (tokenAddressList, publicKey) => ({
	type: TOKENS.FETCH_TOKENS_INFO,
	request: {
		url: 'getTokensInfo',
		params: {
			publicKey,
			tokenAddress: tokenAddressList,
		},
	},
});
