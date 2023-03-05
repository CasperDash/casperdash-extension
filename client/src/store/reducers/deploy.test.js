import { getLocalStorageValue } from '../../services/localStorage';
import deployReducer from './deploys';

jest.mock('../../services/localStorage', () => {
	return {
		getLocalStorageValue: jest.fn(),
		getNetworkStorageKey: jest.fn().mockReturnValue('casper-test'),
	};
});

test('Should return PUSH_TRANSFER_TO_LOCAL_STORAGE transfer state', () => {
	expect(deployReducer(undefined, { type: 'DEPLOY.PUSH_TRANSFER_TO_LOCAL_STORAGE', payload: [] })).toEqual({
		transfers: [[]],
	});
});

test('Should return GET_TRANSFERS_FROM_LOCAL_STORAGE transfer state', () => {
	expect(deployReducer({}, { type: 'DEPLOY.GET_TRANSFERS_FROM_LOCAL_STORAGE', payload: 'test' })).toEqual({
		transfers: undefined,
	});
	expect(getLocalStorageValue).toHaveBeenCalled();
});

test('Should return UPDATE_TRANSFER_LOCAL_STORAGE transfer state', () => {
	expect(deployReducer({}, { type: 'DEPLOY.UPDATE_TRANSFER_LOCAL_STORAGE', payload: 'test' })).toEqual({
		transfers: 'test',
	});
});

test('Should return current state state', () => {
	expect(deployReducer({}, { type: 'DEPLOY.TEST', payload: 'test' })).toEqual({});
});
