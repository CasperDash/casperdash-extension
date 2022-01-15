import { massageNFTMintFormValues } from './nft';

test('should return massaged nft values', () => {
	expect(massageNFTMintFormValues({ attribute1: 'test', value1: 'test1', name: 'new nft' })).toEqual({
		image: undefined,
		metadata: [
			{
				key: 'test',
				name: 'test',
				value: 'test1',
			},
		],
		nftContract: undefined,
		nftName: 'new nft',
		recipient: undefined,
	});
});
