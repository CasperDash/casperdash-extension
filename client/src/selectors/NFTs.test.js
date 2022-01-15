import { getQuerySelector } from '@redux-requests/core';
import {
	NFTSelector,
	getNFTInfo,
	getNFTDeployHistory,
	getPendingDeploys,
	getNFTAddressList,
	searchNFT,
	massageNFTInfo,
	sortNFT,
	getMetadataByKey,
} from './NFTs';

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
	expect(getNFTInfo()()).toEqual([]);
});

describe('getNFTDeployHistory', () => {
	test('should return empty history ', () => {
		expect(getNFTDeployHistory({ nfts: {} })).toEqual([]);
	});
	test('should return deploy history with type', () => {
		expect(
			getNFTDeployHistory({
				nfts: { deploys: { installContract: [{ symbol: 'TESTNFT' }], mint: [{ name: 'testname' }] } },
			}),
		).toEqual([
			{
				symbol: 'TESTNFT',
				type: 'Deploy Contract',
			},
			{
				name: 'testname',
				type: 'Mint',
			},
		]);
	});
	test('should return mint history with type', () => {
		expect(
			getNFTDeployHistory({
				nfts: { deploys: { mint: [{ name: 'testname' }] } },
			}),
		).toEqual([
			{
				name: 'testname',
				type: 'Mint',
			},
		]);
	});
});

describe('getPendingDeploys', () => {
	test('should return empty deploy ', () => {
		expect(getPendingDeploys({})).toEqual({});
	});
	test('should return mint deploys ', () => {
		expect(
			getPendingDeploys({
				nfts: {
					deploys: {
						mint: [
							{ name: 'testnft', status: 'pending' },
							{ name: 'testnft', status: 'completed' },
						],
					},
				},
			}),
		).toEqual({
			mint: [
				{
					name: 'testnft',
					status: 'pending',
				},
			],
		});
	});
});

describe('getNFTAddressList', () => {
	test('should return empty address ', () => {
		expect(getNFTAddressList({})).toEqual([]);
	});
	test('should return address ', () => {
		expect(getNFTAddressList({ nfts: { address: ['test1', 'test2', 'test1'] } })).toEqual(['test1', 'test2']);
	});
});

describe('searchNFT', () => {
	const NFTInfo = [{ nftName: 'test1' }, { nftName: 'nft2' }];
	test('should return all NFT ', () => {
		expect(searchNFT(NFTInfo)).toEqual(NFTInfo);
	});
	test('should return NFTs by search term ', () => {
		expect(searchNFT(NFTInfo, 'test')).toEqual([{ nftName: 'test1' }]);
	});
});

describe('massageNFTInfo', () => {
	const NFTInfo = [
		{ nftName: 'test1', metadata: [{ name: 'test' }, { image: 'nft.png' }] },
		{ nftName: 'nft2', metadata: [] },
	];
	test('should massaged nft info ', () => {
		expect(massageNFTInfo(NFTInfo)).toEqual([
			{
				image: undefined,
				metadata: [
					{
						name: 'test',
					},
					{
						image: 'nft.png',
					},
				],
				nftName: undefined,
				totalSupply: undefined,
			},
			{
				image: undefined,
				metadata: [],
				nftName: undefined,
				totalSupply: undefined,
			},
		]);
	});
});

describe('sortNFT', () => {
	const NFTInfo = [
		{ nftName: 'test1', metadata: [{ name: 'test' }, { image: 'nft.png' }], nftContractName: 'test1' },
		{ nftName: 'nft2', metadata: [], nftContractName: 'test12' },
	];
	test('should input nft info', () => {
		expect(sortNFT(NFTInfo)).toEqual(NFTInfo);
	});
	test('should sort by collection', () => {
		expect(sortNFT(NFTInfo, { attr: 'collection' })).toEqual(NFTInfo);
	});
	test('should sort by collection desc', () => {
		expect(sortNFT(NFTInfo, { attr: 'collection', order: 'desc' })).toEqual([
			{ nftName: 'nft2', metadata: [], nftContractName: 'test12' },
			{ nftName: 'test1', metadata: [{ name: 'test' }, { image: 'nft.png' }], nftContractName: 'test1' },
		]);
	});
	test('should sort by name', () => {
		expect(sortNFT(NFTInfo, { attr: 'name' })).toEqual([
			{ nftName: 'nft2', metadata: [], nftContractName: 'test12' },
			{ nftName: 'test1', metadata: [{ name: 'test' }, { image: 'nft.png' }], nftContractName: 'test1' },
		]);
	});
	test('should sort by collection desc', () => {
		expect(sortNFT(NFTInfo, { attr: 'name', order: 'desc' })).toEqual(NFTInfo);
	});
});

describe('getMetadataByKey', () => {
	test('should return undefined value', () => {
		expect(getMetadataByKey([])).toEqual(undefined);
	});
	test('should metadata value', () => {
		expect(getMetadataByKey([{ key: 'name', value: 'test' }], 'name')).toEqual('test');
	});
});
