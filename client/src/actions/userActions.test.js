import { Signer } from 'casper-js-sdk';
import { getUserDetails, updatePublicKeyFromSigner } from './userActions';

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
		expect(mockDispatch).toHaveBeenCalledWith({ type: 'USERS.SET_USER_ADDRESS', payload: { publicKey: 'test' } });
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
