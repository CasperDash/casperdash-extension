import { Signer } from 'casper-js-sdk';
import { getLocalStorageValue } from '../services/localStorage';
import {
	getUserDetails,
	updatePublicKeyFromSigner,
	initConnectedAccountFromLocalStorage,
	lockAccount,
  setPublicKeyToStore,
} from './userActions';

jest.mock('../services/localStorage', () => {
	return {
		setLocalStorageValue: jest.fn(),
		getLocalStorageValue: jest.fn(),
	};
});

test('getUserDetails', () => {
	expect(getUserDetails('test')).toEqual({
		type: 'USERS.FETCH_USER_DETAILS',
		request: { url: `/user/test` },
	});
});

describe('getTokenAddressFromLocalStorage', () => {
	test('Should dispatch to set public key if can get from signer', async () => {
		const mockDispatch = jest.fn();
		const spyGetPublicKey = jest.spyOn(Signer, 'getActivePublicKey');
		spyGetPublicKey.mockReturnValue('test');
		await updatePublicKeyFromSigner()(mockDispatch);
		expect(spyGetPublicKey).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalledWith({
			type: 'USERS.SET_USER_ADDRESS',
			payload: {
				publicKey: 'test',
				loginOptions: {
					connectionType: 'caspersigner',
				},
			},
		});
	});

	test('Should dispatch to set status to lock if can not get public key from signer', async () => {
		const mockDispatch = jest.fn();
		const spyGetPublicKey = jest.spyOn(Signer, 'getActivePublicKey');
		spyGetPublicKey.mockImplementation(() => {
			throw 'no pbkey';
		});
		try {
			await updatePublicKeyFromSigner()(mockDispatch);
		} catch (e) {
			expect(spyGetPublicKey).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalled();
			expect(mockDispatch).toHaveBeenCalledWith({
				type: 'SIGNER.UPDATE_LOCK_STATUS',
				payload: { isLocked: true },
			});
		}
	});
});

test('setPublicKeyToStore', () => {
	expect(setPublicKeyToStore('test')).toEqual({
		type: 'USERS.SET_USER_ADDRESS',
		payload: { publicKey: 'test', loginOptions: {} },
	});
});

test('initConnectedAccountFromLocalStorage have account', () => {
	const mockDispatch = jest.fn();
	getLocalStorageValue.mockReturnValue({ publicKey: 'testpk' });
	const value = initConnectedAccountFromLocalStorage()(mockDispatch);
	expect(mockDispatch).toHaveBeenCalled();
	expect(value).toEqual('testpk');
});

test('initConnectedAccountFromLocalStorage do not have account', () => {
	const mockDispatch = jest.fn();
	getLocalStorageValue.mockReturnValue({});
	const value = initConnectedAccountFromLocalStorage()(mockDispatch);

	expect(value).toEqual(undefined);
});

test('lockAccount', () => {
	const mockDispatch = jest.fn();

	lockAccount()(mockDispatch);
	expect(mockDispatch).toHaveBeenCalled();
});
