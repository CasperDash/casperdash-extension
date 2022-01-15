import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';
import {
	fetchNFTInfo,
	fetchAllNTFContractInfoByPublicKey,
	fetchNFTContractInfo,
	addCustomNFTAddressToLocalStorage,
	getNFTAddressesFromLocalStorage,
	updateNFTLocalStorage,
	getNFTDeploysFromLocalStorage,
	getNFTPendingDeploysStatus,
	updateNFTDeploysStatus,
} from './NFTActions';
jest.mock('../services/localStorage', () => {
	return {
		setLocalStorageValue: jest.fn(),
		getLocalStorageValue: jest.fn(),
	};
});

test('fetchNFTInfo', () => {
	expect(fetchNFTInfo()).toEqual({
		type: 'NFTS.FETCH_NFTS_INFO',
		request: {
			url: '/nfts/getNFTsInfo',
			params: {
				publicKey: undefined,
			},
		},
	});
});

test('fetchAllNTFContractInfoByPublicKey', () => {
	expect(fetchAllNTFContractInfoByPublicKey('test')).toEqual({
		type: 'NFTS.FETCH_NFTS_CONTRACT_INFO',
		request: {
			url: `/nfts/test/NFTContracts`,
		},
	});
});

test('fetchNFTContractInfo', () => {
	expect(fetchNFTContractInfo('test')).toEqual({
		type: 'NFTS.FETCH_NFTS_CONTRACT_INFO',
		request: {
			url: `/nfts/contract/test`,
		},
	});
});

test('addCustomNFTAddressToLocalStorage', () => {
	const mockDispatch = jest.fn();
	setLocalStorageValue.mockReturnValue({ nfts: {} });
	addCustomNFTAddressToLocalStorage()(mockDispatch);
	expect(setLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalledWith({ type: 'NFTS.SET_ADDRESS_LOCAL_STORAGE', payload: [] });
});

test('getNFTAddressesFromLocalStorage', () => {
	const mockDispatch = jest.fn();
	getLocalStorageValue.mockReturnValue({ nfts: {} });
	getNFTAddressesFromLocalStorage()(mockDispatch);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalledWith({ type: 'NFTS.GET_FROM_LOCAL_STORAGE', payload: { nfts: {} } });
});

test('updateNFTLocalStorage', () => {
	const mockDispatch = jest.fn();
	setLocalStorageValue.mockReturnValue({ nfts: {} });
	updateNFTLocalStorage()(mockDispatch);
	expect(setLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalledWith({ type: 'NFTS.UPDATE_LOCAL_STORAGE', payload: {} });
});

test('getNFTDeploysFromLocalStorage', () => {
	const mockDispatch = jest.fn();
	getLocalStorageValue.mockReturnValue({ nfts: {} });
	getNFTDeploysFromLocalStorage()(mockDispatch);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalledWith({ type: 'NFTS.GET_DEPLOY_FROM_LOCAL_STORAGE', payload: { nfts: {} } });
});

test('getNFTPendingDeploysStatus', () => {
	expect(getNFTPendingDeploysStatus('test')).toEqual({
		type: 'NFTS.GET_DEPLOYS_STATUS',
		request: {
			url: '/deploysStatus',
			params: {
				deployHash: 'test',
			},
		},
	});
});

test('updateNFTDeploysStatus with new status', () => {
	const mockDispatch = jest.fn();
	getLocalStorageValue.mockReturnValue({ nfts: [{ hash: 'testhash' }] });
	updateNFTDeploysStatus('test', 'path', [{ hash: 'testhash' }])(mockDispatch);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalled();
});

test('updateNFTDeploysStatus keep current status', () => {
	const mockDispatch = jest.fn();
	getLocalStorageValue.mockReturnValue({ nfts: [{ hash: 'testhash1' }] });
	updateNFTDeploysStatus('test', 'path', [{ hash: 'testhash' }])(mockDispatch);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalled();
});
