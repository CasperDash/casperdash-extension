import { nftContractDeploy, getMintDeploy } from './nftServices';

test('failed to get NFT contract deploy', async () => {
	try {
		await nftContractDeploy({
			fromAddress: '01f61a91b5da6e870995aa60ccefee17a38a42823a877343c8d468c971e9ab3d06',
			name: 'TEST NFT',
			symbol: 'TEST',
		});
	} catch (error) {
		expect(error.message).toEqual('Failed to get NFT contract deploy.');
	}
});

test('getMintDeploy', async () => {
	const deploy = getMintDeploy({
		metadata: [['name', 'test']],
		publicKey: '01f61a91b5da6e870995aa60ccefee17a38a42823a877343c8d468c971e9ab3d06',
		nftContract: 'hash-f4a75b1a0c1858bc4883165441107e0d23756e4ebdbd558918ad39231f1c7728',
	});
	expect(Object.keys(deploy)).toEqual(['approvals', 'session', 'payment', 'header', 'hash']);
});

test('getMintDeploy throw error', async () => {
	try {
		getMintDeploy({
			metadata: [['name', 'test']],
			publicKey: '01f61a91b5da6e870995aa60ccefee17a38a42823a877343c8d468c971e9ab3d06',
			nftContract: 'hash-f4a75b1a0c1858bc4883165441107e0d23756e4ebdbd558918ad39231f1c7728',
		});
	} catch (error) {
		expect(error.message).toEqual('Failed to get mint NFT contract deploy.');
	}
});
