import { Signer } from 'casper-js-sdk';
import {
	getUserDetails,
	updatePublicKeyFromSigner,
	initConnectedAccountFromLocalStorage,
	lockAccount,
  setPublicKeyToStore
} from './userActions';
const getConnectedAccountChromeLocalStorage = require("./userActions.utils").getConnectedAccountChromeLocalStorage;

jest.mock("./userActions.utils", () => ({
  getConnectedAccountChromeLocalStorage: jest.fn(),
  cacheLoginInfoToLocalStorage: jest.fn()
}));
jest.mock('../services/localStorage', () => {
	return {
    getChromeStorageLocal: jest.fn(), 
    setChromeStorageLocal: jest.fn(),
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


describe("initConnectedAccountFromLocalStorage", () => {
  it('Should return public key on init successfully', async () => {
    const mockDispatch = jest.fn();
    getConnectedAccountChromeLocalStorage.mockResolvedValue({ publicKey: 'testpk' });
    const value = await initConnectedAccountFromLocalStorage()(mockDispatch);
    await expect(mockDispatch).toHaveBeenCalled();
    await expect(value).toEqual('testpk');
  });

  it('Should return undefined when not found connected account from local storage', async () => {
    const mockDispatch = jest.fn();
    getConnectedAccountChromeLocalStorage.mockResolvedValue();
    const value = await initConnectedAccountFromLocalStorage()(mockDispatch);

    expect(value).toEqual(undefined);
  });
});

test('lockAccount', () => {
	const mockDispatch = jest.fn();

	lockAccount()(mockDispatch);
	expect(mockDispatch).toHaveBeenCalled();
});
