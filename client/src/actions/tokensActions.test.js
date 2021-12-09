import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';
import {
	fetchTokensInfoWithBalance,
	getTokenInfo,
	addCustomTokenAddressToLocalStorage,
	getTokenAddressFromLocalStorage,
} from './tokensActions';

jest.mock('../services/localStorage', () => {
	return {
		setLocalStorageValue: jest.fn(),
		getLocalStorageValue: jest.fn(),
	};
});

test('fetchTokensInfoWithBalance', () => {
	expect(fetchTokensInfoWithBalance()).toEqual({
		type: 'TOKENS.FETCH_TOKENS_INFO_WITH_BALANCE',
		request: {
			url: '/tokens/getTokensInfo',
			params: {
				publicKey: undefined,
				tokenAddress: [undefined],
			},
		},
	});
});

test('getTokenInfo', () => {
	expect(getTokenInfo('test')).toEqual({
		type: 'TOKENS.FETCH_TOKEN_INFO',
		request: {
			url: `/token/test`,
		},
	});
});

test('addCustomTokenAddressToLocalStorage', () => {
	const mockDispatch = jest.fn();
	setLocalStorageValue.mockReturnValue({ tokens: {} });
	addCustomTokenAddressToLocalStorage('address', 'pbkeytest')(mockDispatch);
	expect(setLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalled();
});

test('getTokenAddressFromLocalStorage', () => {
	const mockDispatch = jest.fn();
	getLocalStorageValue.mockReturnValue();
	getTokenAddressFromLocalStorage('pbkeytest')(mockDispatch);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalled();
});
