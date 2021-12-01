import { getQuerySelector } from '@redux-requests/core';
import { getPublicKey, userDetailsSelector, getMassagedUserDetails } from './user';

jest.mock('@redux-requests/core', () => {
	return {
		getQuerySelector: jest.fn().mockReturnValue(() => ({ data: { balance: { hex: 0x11 } } })),
	};
});

test('getPublicKey should return public key ', () => {
	expect(getPublicKey({ user: { publicKey: 'test' } })).toEqual('test');
});

test('userDetailsSelector should call getQuerySelector ', () => {
	userDetailsSelector;
	expect(getQuerySelector).toHaveBeenCalled();
});

test('getMassagedUserDetails should return user info with balance', () => {
	expect(getMassagedUserDetails()).toEqual({ balance: { displayBalance: 1.7e-8, hex: 17, mote: 17 } });
});
