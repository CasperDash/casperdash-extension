import { getTransferDeploy } from './nftServices';

test('getTransferDeploy', async () => {
	const deploy = getTransferDeploy({
		recipient: '01f61a91b5da6e870995aa60ccefee17a38a42823a877343c8d468c971e9ab3d06',
		publicKey: '01f61a91b5da6e870995aa60ccefee17a38a42823a877343c8d468c971e9ab3d06',
		nftContract: 'hash-f4a75b1a0c1858bc4883165441107e0d23756e4ebdbd558918ad39231f1c7728',
		tokenId: '1',
	});

	expect(Object.keys(deploy)).toEqual(['approvals', 'session', 'payment', 'header', 'hash']);
});

test('getTransferDeploy throws error', async () => {
	try {
		getTransferDeploy({
			recipient: '01f61a91b5da6e870995aa60ccefee17a38a42823a877343c8d468c971e9ab3d06',
			publicKey: '01f61a91b5da6e870995aa60ccefee17a38a42823a877343c8d468c971e9ab3d06',
			nftContract: 'hash-f4a75b1a0c1858bc4883165441107e0d23756e4ebdbd558918ad39231f1c7728',
			tokenId: 1,
		});
	} catch (error) {
		expect(error.message).toEqual(
			'Failed to get transfer NFT deploy due to Error: Wrong data type, you should provide string, but you provided number',
		);
	}
});
