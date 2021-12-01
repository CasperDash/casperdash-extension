import { getQuerySelector } from '@redux-requests/core';
import { getNFTAddressList, NFTSelector, getNFTInfo } from './NFTs';

jest.mock('@redux-requests/core', () => {
	return {
		getQuerySelector: jest.fn().mockReturnValue(() => ({})),
	};
});

test('getNFTAddressList should return default NFT address list ', () => {
	expect(getNFTAddressList()).toEqual(['6cdf5a5e23eedb6b79cfe52d16fa07cbdece9516b13dde03e6c28b288d5c3a7c']);
});

test('NFTSelector should call getQuerySelector ', () => {
	NFTSelector;
	expect(getQuerySelector).toHaveBeenCalled();
});

test('getNFTInfo should return NFT data ', () => {
	expect(getNFTInfo()).toEqual([]);
});
