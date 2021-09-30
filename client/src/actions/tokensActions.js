import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';
import { TOKENS } from '../store/actionTypes';

export const fetchTokensInfoWithBalance = (tokenAddressList, publicKey) => ({
	type: TOKENS.FETCH_TOKENS_INFO_WITH_BALANCE,
	request: {
		url: '/tokens/getTokensInfo',
		params: {
			publicKey,
			tokenAddress: tokenAddressList,
		},
	},
});

export const getTokenInfo = (tokenAddress) => ({
	type: TOKENS.FETCH_TOKEN_INFO,
	request: {
		url: `/token/${tokenAddress}`,
	},
});

export const addCustomTokenAddressToLocalStorage = (tokenAddress, publicKey) => {
	return (dispatch) => {
		const { tokens } = setLocalStorageValue(publicKey, 'tokens.address', tokenAddress, 'push');
		dispatch({
			type: TOKENS.SET_LOCAL_STORAGE,
			payload: tokens.address || [],
		});
	};
};

export const getTokenAddressFromLocalStorage = (publicKey) => {
	return (dispatch) => {
		const localStorageValue = getLocalStorageValue(publicKey, 'tokens.address');
		dispatch({
			type: TOKENS.GET_FROM_LOCAL_STORAGE,
			payload: localStorageValue || [],
		});
	};
};
