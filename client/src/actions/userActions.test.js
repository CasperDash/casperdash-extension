import { Signer } from 'casper-js-sdk';
import { act } from '@testing-library/react';
import { isUsingExtension } from '@cd/services/localStorage';
import {
	getUserDetails,
	updatePublicKeyFromSigner,
	initConnectedAccountFromLocalStorage,
	deleteAllUserData,
	setPublicKeyToStore,
	lockAccount
} from './userActions';
import { cacheLoginInfoToLocalStorage, getConnectedAccountChromeLocalStorage } from "./userActions.utils";

jest.mock('./userActions.utils', () => ({
	getConnectedAccountChromeLocalStorage: jest.fn(),
	cacheLoginInfoToLocalStorage: jest.fn(),
}));
jest.mock('@cd/services/localStorage', () => {
	return {
		isUsingExtension: jest.fn(),
		getChromeStorageLocal: jest.fn(),
		setChromeStorageLocal: jest.fn(),
		setLocalStorageValue: jest.fn(),
		getLocalStorageValue: jest.fn(),
	};
});

jest.mock("@cd/hooks/useServiceWorker", () => ({
	onClearUserSW: jest.fn()
}))

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

describe('initConnectedAccountFromLocalStorage', () => {
	it('Should return public key on init successfully', async () => {
		const mockDispatch = jest.fn();
		isUsingExtension.mockResolvedValue(true);
		getConnectedAccountChromeLocalStorage.mockResolvedValue({ publicKey: 'testpk' });
		const value = await initConnectedAccountFromLocalStorage()(mockDispatch);
		await expect(mockDispatch).toHaveBeenCalled();
		await expect(value).toEqual('testpk');
	});

	it('Should return undefined when not found connected account from local storage', async () => {
		const mockDispatch = jest.fn();
		isUsingExtension.mockResolvedValue(true);
		getConnectedAccountChromeLocalStorage.mockResolvedValue();
		const value = await initConnectedAccountFromLocalStorage()(mockDispatch);

		expect(value).toEqual(undefined);
	});
});

describe("Delete all data", () => {
	test('deleteAllUserData', () => {
		const mockDispatch = jest.fn();

		deleteAllUserData()(mockDispatch);
		expect(mockDispatch).toHaveBeenCalled();
	});
})

describe("lockAccount", () => {
	test('lockAccount', async () => {
		getConnectedAccountChromeLocalStorage.mockResolvedValue({ publicKey: 'testpk', loginOptions: { name: "Test"} });
		const mockDispatch = jest.fn();
		const mockGetState = jest.fn().mockImplementation(() => ({
			user: {
				loginOptions: { name: "Test" }
			}
		}));

		await act(async () => {
			await lockAccount()(mockDispatch, mockGetState);
		})

		expect(cacheLoginInfoToLocalStorage).toHaveBeenCalledWith("", { name: "Test"});
		expect(mockDispatch).toHaveBeenCalled();
	});
})
