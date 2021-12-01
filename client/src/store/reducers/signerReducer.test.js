import signerReducer from './signerReducer';

test('Should return new UPDATE_CONNECT_STATUS signer state', () => {
	expect(signerReducer(undefined, { type: 'SIGNER.UPDATE_CONNECT_STATUS', payload: { isConnected: true } })).toEqual({
		isConnected: true,
		isUnlocked: true,
		error: null,
	});
});

test('Should return new UPDATE_LOCK_STATUS signer state', () => {
	expect(
		signerReducer(
			{ isConnected: false, isUnlocked: true, error: null },
			{ type: 'SIGNER.UPDATE_LOCK_STATUS', payload: { isUnlocked: false } },
		),
	).toEqual({ isConnected: false, isUnlocked: false, error: null });
});

test('Should return new SET_CONNECT_ERROR signer state', () => {
	expect(
		signerReducer(
			{ isConnected: false, isUnlocked: true, error: null },
			{ type: 'SIGNER.SET_CONNECT_ERROR', payload: { error: 'error' } },
		),
	).toEqual({ isConnected: false, isUnlocked: true, error: 'error' });
});

test('Should return new CLEAR_CONNECT_ERROR signer state', () => {
	expect(
		signerReducer({ isConnected: false, isUnlocked: true, error: 'test' }, { type: 'SIGNER.CLEAR_CONNECT_ERROR' }),
	).toEqual({ isConnected: false, isUnlocked: true, error: null });
});

test('Should return current state', () => {
	expect(signerReducer({}, { type: 'SIGNER.TEST', payload: 'test' })).toEqual({});
});
