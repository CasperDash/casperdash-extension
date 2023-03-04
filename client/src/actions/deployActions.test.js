import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';
import {
	updateTransferDeploysLocalStorage,
	updateTransferDeployStatus,
	pushTransferToLocalStorage,
	putDeploy,
	getLatestBlockHash,
	getTransferDeploysStatus,
} from './deployActions';

jest.mock('../services/localStorage', () => {
	return {
		setLocalStorageValue: jest.fn(),
		getLocalStorageValue: jest.fn(),
		getNetworkStorageKey: jest.fn().mockReturnValue('casper-test'),
	};
});

const mockDispatch = jest.fn().mockImplementation((value) => value);
const mockGetState = jest.fn().mockReturnValue({ settings: { network: 'casper-test' } });
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
		setLocalStorageValue.mockReturnValue({});
		updateTransferDeploysLocalStorage(
			'pbkeytest',
			'local.path',
			{ test: 'test' },
			'push',
		)(mockDispatch, mockGetState);
		expect(setLocalStorageValue).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();
	});
	test('Should call setLocalStorageValue and dispatch deploy value', () => {
		setLocalStorageValue.mockReturnValue({ deploys: { transfers: [] } });
		updateTransferDeploysLocalStorage(
			'pbkeytest',
			'local.path',
			{ test: 'test' },
			'push',
		)(mockDispatch, mockGetState);
		expect(setLocalStorageValue).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();
	});
});

describe('updateTransferDeployStatus', () => {
	test('Should get local storage value', () => {
		getLocalStorageValue.mockReturnValue([{ deployHash: 'test', status: 'success' }]);
		updateTransferDeployStatus('pbkeytest', 'local.path', [{ hash: 'test' }])(mockDispatch, mockGetState);
		expect(getLocalStorageValue).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();

		updateTransferDeployStatus('pbkeytest', 'local.path', [{ hash: 'test' }])(mockDispatch, mockGetState);
		expect(getLocalStorageValue).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();
	});
	test('Should get local storage value and dispatch', () => {
		getLocalStorageValue.mockReturnValue();
		updateTransferDeployStatus('pbkeytest', 'local.path')(mockDispatch, mockGetState);
		expect(getLocalStorageValue).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();
	});
	test('Should ignore the deploy do not have deployHash', () => {
		getLocalStorageValue.mockReturnValue([{ deployHash: 'test', status: 'pending' }, { status: 'pending' }]);
		updateTransferDeployStatus('pbkeytest', 'local.path', [{ hash: 'test' }])(mockDispatch, mockGetState);
		expect(getLocalStorageValue).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();
	});
});

describe('pushTransferToLocalStorage', () => {
	test('Should set value to local storage', () => {
		pushTransferToLocalStorage('pbkeytest', { test: 'test' })(mockDispatch, mockGetState);
		expect(setLocalStorageValue).toHaveBeenCalled();
		expect(mockDispatch).toHaveBeenCalled();
	});
});
