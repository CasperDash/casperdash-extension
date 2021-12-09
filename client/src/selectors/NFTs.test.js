import { getQuerySelector } from '@redux-requests/core';
import { NFTSelector, getNFTInfo } from './NFTs';

jest.mock('@redux-requests/core', () => {
	return {
		getQuerySelector: jest.fn().mockReturnValue(() => ({})),
	};
});

test('NFTSelector should call getQuerySelector ', () => {
	NFTSelector;
	expect(getQuerySelector).toHaveBeenCalled();
});

test('getNFTInfo should return NFT data ', () => {
	expect(getNFTInfo()).toEqual([]);
});
