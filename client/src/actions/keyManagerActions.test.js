import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';
import {
	fetchKeyManagerDetails,
	putWeightDeploy,
	deployKeyManagerContract,
	updateKeysManagerLocalStorage,
	updateKeysManagerDeployStatus,
	getKeysManagerLocalStorage,
	getKeysManagerPendingDeploys,
} from './keyManagerActions';

jest.mock('../services/localStorage', () => {
	return {
		setLocalStorageValue: jest.fn(),
		getLocalStorageValue: jest.fn(),
	};
});

test('getTransferDeploysStatus', () => {
	expect(fetchKeyManagerDetails('test')).toEqual({
		type: 'KEY_MANAGER.FETCH_KEY_MANAGER_DETAILS',
		request: { url: `/keyManager/test` },
	});
});

test('putWeightDeploy', () => {
	expect(putWeightDeploy({})).toEqual({
		type: 'KEY_MANAGER.PUT_WEIGHT_DEPLOY',
		request: {
			method: 'POST',
			url: '/deploy',
			data: {},
		},
	});
});

test('deployKeyManagerContract', () => {
	expect(deployKeyManagerContract({})).toEqual({
		type: 'KEY_MANAGER.DEPLOY_KEY_MANAGER_CONTRACT',
		request: {
			method: 'POST',
			url: '/deployKeyManagerContract',
			data: {},
		},
	});
});

test('updateKeysManagerLocalStorage', () => {
	setLocalStorageValue.mockReturnValue({ keysManager: {} });
	const dispatch = jest.fn();
	updateKeysManagerLocalStorage('testpkey', 'patch', {}, 'set')(dispatch);
	expect(setLocalStorageValue).toHaveBeenCalled();
	expect(dispatch).toHaveBeenCalled();
	expect(dispatch).toHaveBeenCalledWith({
		type: 'KEY_MANAGER.UPDATE_LOCAL_STORAGE',
		payload: {},
	});
});

test('updateKeysManagerDeployStatus', () => {
	getLocalStorageValue.mockReturnValue({ keyWeight: [{ hash: 'test' }] });
	const dispatch = jest.fn();
	updateKeysManagerDeployStatus('testpkey', 'patch', [{ hash: 'test' }])(dispatch);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(getLocalStorageValue).toHaveBeenCalledWith('testpkey', 'patch');
	expect(dispatch).toHaveBeenCalled();
});

test('updateKeysManagerDeployStatus', () => {
	getLocalStorageValue.mockReturnValue({ keyWeight: [{ hash: 'test' }] });
	const dispatch = jest.fn();
	updateKeysManagerDeployStatus('testpkey', 'patch')(dispatch);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(getLocalStorageValue).toHaveBeenCalledWith('testpkey', 'patch');
	expect(dispatch).toHaveBeenCalled();
});

test('getKeysManagerLocalStorage', () => {
	getLocalStorageValue.mockReturnValue();
	const dispatch = jest.fn();
	getKeysManagerLocalStorage('testpkey')(dispatch);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(getLocalStorageValue).toHaveBeenCalledWith('testpkey', 'keysManager');
	expect(dispatch).toHaveBeenCalled();
	expect(dispatch).toHaveBeenCalledWith({
		type: 'KEY_MANAGER.GET_LOCAL_STORAGE',
		payload: { deploys: {} },
	});
});

test('getKeysManagerLocalStorage', () => {
	getLocalStorageValue.mockReturnValue({ deploys: { test: [] } });
	const dispatch = jest.fn();
	getKeysManagerLocalStorage('testpkey')(dispatch);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(getLocalStorageValue).toHaveBeenCalledWith('testpkey', 'keysManager');
	expect(dispatch).toHaveBeenCalled();
	expect(dispatch).toHaveBeenCalledWith({
		type: 'KEY_MANAGER.GET_LOCAL_STORAGE',
		payload: { deploys: { test: [] } },
	});
});

test('getKeysManagerPendingDeploys', () => {
	expect(getKeysManagerPendingDeploys('test')).toEqual({
		type: 'KEY_MANAGER.GET_DEPLOYS_STATUS',
		request: {
			url: '/deploysStatus',
			params: {
				deployHash: 'test',
			},
		},
	});
});
