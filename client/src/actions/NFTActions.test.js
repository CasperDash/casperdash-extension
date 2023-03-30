import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';
import {
	fetchNFTInfo,
	addCustomNFTAddressToLocalStorage,
	getNFTAddressesFromLocalStorage,
	updateNFTLocalStorage,
	getNFTPendingDeploysStatus,
	updateNFTDeploysStatus,
} from './NFTActions';
jest.mock('../services/localStorage', () => {
	return {
		setLocalStorageValue: jest.fn(),
		getLocalStorageValue: jest.fn(),
		getNetworkStorageKey: jest.fn(),
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

const mockDispatch = jest.fn();
const mockGetState = jest.fn().mockReturnValue({ settings: { network: 'casper-test' } });
test('addCustomNFTAddressToLocalStorage', () => {
	setLocalStorageValue.mockReturnValue({ nfts: {} });
	addCustomNFTAddressToLocalStorage()(mockDispatch, mockGetState);
	expect(setLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalledWith({ type: 'NFTS.SET_ADDRESS_LOCAL_STORAGE', payload: [] });
});

test('getNFTAddressesFromLocalStorage', () => {
	getLocalStorageValue.mockReturnValue({ nfts: {} });
	getNFTAddressesFromLocalStorage()(mockDispatch, mockGetState);
	expect(getLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalledWith({ type: 'NFTS.GET_FROM_LOCAL_STORAGE', payload: { nfts: {} } });
});

test('updateNFTLocalStorage', () => {
	const mockDispatch = jest.fn();

	setLocalStorageValue.mockReturnValue({ nfts: {} });
	updateNFTLocalStorage()(mockDispatch, mockGetState);
	expect(setLocalStorageValue).toHaveBeenCalled();
	expect(mockDispatch).toHaveBeenCalledWith({ type: 'NFTS.UPDATE_LOCAL_STORAGE', payload: {} });
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
