import { fetchNFTInfo } from './NFTActions';

test('fetchPriceHistory', () => {
	expect(fetchNFTInfo()).toEqual({
		type: 'NFTS.FETCH_NFTS_INFO',
		request: {
			url: '/nfts/getNFTsInfo',
			params: {
				publicKey: undefined,
				tokenAddress: undefined,
			},
		},
	});
});
