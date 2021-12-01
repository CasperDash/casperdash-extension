import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';
import {
	updateTransferDeploysLocalStorage,
	updateTransferDeployStatus,
	pushTransferToLocalStorage,
	putDeploy,
	getLatestBlockHash,
	getTransfersFromLocalStorage,
	getTransferDeploysStatus,
} from './deployActions';

jest.mock('../services/localStorage', () => {
	return {
		setLocalStorageValue: jest.fn(),
		getLocalStorageValue: jest.fn(),
	};
});

test('getTransferDeploysStatus', () => {
	expect(getTransferDeploysStatus()).toEqual({
		type: 'DEPLOY.GET_DEPLOYS_STATUS',
		request: {
			url: '/deploysStatus',
			params: {
				deployHash: undefined,
			},
		},
	});
});

test('getTransfersFromLocalStorage', () => {
	expect(getTransfersFromLocalStorage()).toEqual({
		type: 'DEPLOY.GET_TRANSFERS_FROM_LOCAL_STORAGE',
		payload: undefined,
	});
});

test('putDeploy', () => {
	expect(putDeploy()).toEqual({
		type: 'DEPLOY.PUT_DEPLOY',
		request: {
			method: 'POST',
			url: '/deploy',
			data: undefined,
		},
	});
});

test('getLatestBlockHash', () => {
	expect(getLatestBlockHash()).toEqual({
		type: 'DEPLOY.GET_LATEST_BLOCK_HASH',
		request: {
			url: '/getLatestBlockHash',
		},
	});
});

describe('updateTransferDeploysLocalStorage', () => {
	test('Should call setLocalStorageValue and dispatch', () => {
		const mockDispatch = jest.fn();
		setLocalStorageValue.mockReturnValue({});
		updateTransferDeploysLocalStorage('pbkeytest', 'local.path', { test: 'test' }, 'push')(mockDispatch);
		expect(setLocalStorageValue).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();
	});
	test('Should call setLocalStorageValue and dispatch deploy value', () => {
		const mockDispatch = jest.fn();
		setLocalStorageValue.mockReturnValue({ deploys: { transfers: [] } });
		updateTransferDeploysLocalStorage('pbkeytest', 'local.path', { test: 'test' }, 'push')(mockDispatch);
		expect(setLocalStorageValue).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();
	});
});

describe('updateTransferDeployStatus', () => {
	test('Should get local storage value', () => {
		const mockDispatch = jest.fn();
		getLocalStorageValue.mockReturnValue([{ deployHash: 'test', status: 'success' }]);
		updateTransferDeployStatus('pbkeytest', 'local.path', [{ hash: 'test' }])(mockDispatch);
		expect(getLocalStorageValue).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();

		updateTransferDeployStatus('pbkeytest', 'local.path', [{ hash: 'test' }])(mockDispatch);
		expect(getLocalStorageValue).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();
	});
	test('Should get local storage value and dispatch', () => {
		const mockDispatch = jest.fn();
		getLocalStorageValue.mockReturnValue();
		updateTransferDeployStatus('pbkeytest', 'local.path')(mockDispatch);
		expect(getLocalStorageValue).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();
	});
});

describe('pushTransferToLocalStorage', () => {
	test('Should set value to local storage', () => {
		const mockDispatch = jest.fn();
		pushTransferToLocalStorage('pbkeytest', { test: 'test' })(mockDispatch);
		expect(setLocalStorageValue).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();
	});
});
