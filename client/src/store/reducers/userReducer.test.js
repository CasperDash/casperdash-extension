// eslint-disable-next-line no-unused-vars
import { _initialState } from '../index';
import userReducer from './userReducer';

test('Should return new SET_USER_ADDRESS  state', () => {
	expect(userReducer(undefined, { type: 'USERS.SET_USER_ADDRESS', payload: { publicKey: 'testpkey' } })).toEqual({
		accountIndex: 0,
		loginOptions: {},
		publicKey: 'testpkey',
		balance: null,
	});
});

test('Should return current state', () => {
	expect(userReducer({}, { type: 'USERS.TEST', payload: 'test' })).toEqual({});
});
