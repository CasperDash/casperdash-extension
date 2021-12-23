import { fetchNFTInfo } from './NFTActions';

jest.mock('../services/localStorage', () => {
	return {
		setLocalStorageValue: jest.fn(),
		getLocalStorageValue: jest.fn(),
	};
});

test('fetchPriceHistory', () => {
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
