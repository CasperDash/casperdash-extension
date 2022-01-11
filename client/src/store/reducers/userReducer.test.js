import userReducer from './userReducer';

test('Should return new SET_USER_ADDRESS  state', () => {
	expect(userReducer(undefined, { type: 'USERS.SET_USER_ADDRESS', payload: { publicKey: 'testpkey' } })).toEqual({
		loginOptions: {},
		publicKey: 'testpkey',
	});
});

test('Should return current state', () => {
	expect(userReducer({}, { type: 'USERS.TEST', payload: 'test' })).toEqual({});
});
