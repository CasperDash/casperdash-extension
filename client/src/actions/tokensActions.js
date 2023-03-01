import { setLocalStorageValue, getLocalStorageValue, getNetworkStorageKey } from '../services/localStorage';
import { TOKENS } from '../store/actionTypes';

/**
 * @param {Array} tokenAddressList
 * @param {string} publicKey
 * @returns {object}
 */
export const fetchTokensInfoWithBalance = (tokenAddressList, publicKey) => ({
	type: TOKENS.FETCH_TOKENS_INFO_WITH_BALANCE,
	request: {
		url: '/tokens/getTokensInfo',
		params: {
			publicKey,
			tokenAddress: Array.isArray(tokenAddressList) ? tokenAddressList : [tokenAddressList],
		},
	},
});

/**
 * @param {string} tokenAddress
 * @returns {object}
 */
export const getTokenInfo = (tokenAddress) => ({
	type: TOKENS.FETCH_TOKEN_INFO,
	request: {
		url: `/token/${tokenAddress}`,
	},
});

/**
 * @param {string} tokenAddress
 * @param {string} publicKey
 * @returns
 */
export const addCustomTokenAddressToLocalStorage = (tokenAddress, publicKey) => {
	return (dispatch, getState) => {
		const network = getState().settings.network;
		const { tokens } = setLocalStorageValue(
			publicKey,
			getNetworkStorageKey('tokens.address', network),
			tokenAddress,
			'push',
		);
		dispatch({
			type: TOKENS.SET_LOCAL_STORAGE,
			payload: tokens.address || [],
		});
	};
};

/**
 * @param {string} publicKey
 * @returns
 */
export const getTokenAddressFromLocalStorage = (publicKey) => {
	return (dispatch, getState) => {
		const network = getState().settings.network;
		const localStorageValue = getLocalStorageValue(publicKey, getNetworkStorageKey('tokens.address', network));
		dispatch({
			type: TOKENS.GET_FROM_LOCAL_STORAGE,
			payload: localStorageValue || [],
		});
	};
};
