import { updateConnectStatus, updateLockStatus, handleUnlockSigner, handleLockSigner } from './signerActions';

test('updateConnectStatus', () => {
	expect(updateConnectStatus()).toEqual({
		type: 'SIGNER.UPDATE_CONNECT_STATUS',
		payload: { isConnected: undefined },
	});
});

test('updateLockStatus', () => {
	expect(updateLockStatus()).toEqual({ type: 'SIGNER.UPDATE_CONNECT_STATUS', payload: { isLocked: undefined } });
});

test('handleUnlockSigner', () => {
	const dispatch = jest.fn();
	handleUnlockSigner({})(dispatch);
	expect(dispatch).toBeCalledTimes(2);
});

test('handleLockSigner', () => {
	expect(handleLockSigner()).toEqual({ type: 'SIGNER.UPDATE_LOCK_STATUS', payload: { isUnlocked: false } });
});
