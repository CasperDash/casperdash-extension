import keysManagerReducer from './keysManager';

test('Should return KEY_MANAGER.UPDATE_LOCAL_STORAGE transfer state', () => {
	expect(
		keysManagerReducer(undefined, { type: 'KEY_MANAGER.UPDATE_LOCAL_STORAGE', payload: { test: 'abc' } }),
	).toEqual({ test: 'abc' });
});

test('Should return KEY_MANAGER.GET_LOCAL_STORAGE transfer state', () => {
	expect(keysManagerReducer(undefined, { type: 'KEY_MANAGER.GET_LOCAL_STORAGE', payload: { test: 'abc' } })).toEqual({
		test: 'abc',
	});
});

test('Should return current state', () => {
	expect(keysManagerReducer(undefined, { type: 'KEY_MANAGER.TEST', payload: { test: 'abc' } })).toEqual({});
});
