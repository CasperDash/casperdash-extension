import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';
import {
	fetchValidators,
	getStakeFromLocalStorage,
	pushStakeToLocalStorage,
	updateStakeDeployStatus,
	updateStakeDeploysLocalStorage,
} from './stakeActions';

jest.mock('../services/localStorage', () => {
	return {
		setLocalStorageValue: jest.fn(),
		getLocalStorageValue: jest.fn(),
	};
});

test('fetchValidators', () => {
	expect(fetchValidators()).toEqual({
		type: 'VALIDATORS.FETCH_ACTIVE_VALIDATORS',
		request: {
			url: 'v2/validators',
		},
	});
});

test('fetchValidators with public key', () => {
	expect(fetchValidators('0x00')).toEqual({
		type: 'VALIDATORS.FETCH_ACTIVE_VALIDATORS',
		request: {
			url: 'v2/validators?delegator=0x00&cachedBy=block',
		},
	});
});

test('getStakeFromLocalStorage', () => {
	expect(getStakeFromLocalStorage('0x00')).toEqual({
		type: 'STAKE.GET_STAKE_FROM_LOCAL_STORAGE',
		payload: '0x00',
	});
});

test('pushStakeToLocalStorage', () => {
	const mockDispatch = jest.fn();
	setLocalStorageValue.mockReturnValue({});
	pushStakeToLocalStorage('0x123', [])(mockDispatch);
	expect(setLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalled();
});

test('Update stakes with the empty local storage', () => {
	const mockDispatch = jest.fn();
	getLocalStorageValue.mockReturnValue([]);
	updateStakeDeployStatus('0x123', 'stakes')(mockDispatch);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalled();
});

test('Update stakes with the existing local storage', () => {
	const mockDispatch = jest.fn();
	getLocalStorageValue.mockReturnValue([
		{},
		{
			deployHash: '0x111',
		},
	]);
	updateStakeDeployStatus('0x123', 'stakes', ['0x111'])(mockDispatch);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalled();
});

test('updateStakeDeploysLocalStorage', () => {
	const mockDispatch = jest.fn();
	setLocalStorageValue.mockReturnValue([]);
	updateStakeDeploysLocalStorage('0x111', 'deploys', '1', 'delegate')(mockDispatch);
	expect(setLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalledWith({
		type: 'STAKE.UPDATE_STAKES_LOCAL_STORAGE',
		payload: [],
	});
});
