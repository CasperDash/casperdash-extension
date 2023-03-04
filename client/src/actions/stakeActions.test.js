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
		getNetworkStorageKey: jest.fn().mockReturnValue('casper-test'),
	};
});

const mockDispatch = jest.fn().mockImplementation((value) => value);
const mockGetState = jest.fn().mockReturnValue({ settings: { network: 'casper-test' } });

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
	expect(getStakeFromLocalStorage('0x00')(mockDispatch, mockGetState)).toEqual({
		payload: {
			network: 'casper-test',
			publicKey: '0x00',
		},
		type: 'STAKE.GET_STAKE_FROM_LOCAL_STORAGE',
	});
});

test('pushStakeToLocalStorage', () => {
	setLocalStorageValue.mockReturnValue({});
	pushStakeToLocalStorage('0x123', [])(mockDispatch, mockGetState);
	expect(setLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalled();
});

test('Update stakes with the empty local storage', () => {
	getLocalStorageValue.mockReturnValue([]);
	updateStakeDeployStatus('0x123', 'stakes')(mockDispatch, mockGetState);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalled();
});

test('Update stakes with the existing local storage', () => {
	getLocalStorageValue.mockReturnValue([
		{},
		{
			deployHash: '0x111',
		},
	]);
	updateStakeDeployStatus('0x123', 'stakes', ['0x111'])(mockDispatch, mockGetState);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalled();
});

test('updateStakeDeploysLocalStorage', () => {
	setLocalStorageValue.mockReturnValue([]);
	updateStakeDeploysLocalStorage('0x111', 'deploys', '1', 'delegate')(mockDispatch, mockGetState);
	expect(setLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalledWith({
		type: 'STAKE.UPDATE_STAKES_LOCAL_STORAGE',
		payload: [],
	});
});
