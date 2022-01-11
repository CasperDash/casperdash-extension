import { getStakeDeploy } from './stakeServices';
import { signDeploy } from './casperServices';
jest.mock('./casperServices', () => {
	return {
		signDeploy: jest.fn(),
	};
});

test('getTransferTokenDeploy', () => {
	getStakeDeploy({
		fromAddress: '01f61a91b5da6e870995aa60ccefee17a38a42823a877343c8d468c971e9ab3d06',
		validator: '0101a458AA2b551C5a49E56326f9BB298bb308e1babc875647aE0290C42F13feac',
		amount: 10000,
		fee: 1,
	});
	expect(signDeploy).toHaveBeenCalled();
});

test('getTransferTokenDeploy return error', async () => {
	try {
		await getStakeDeploy({
			fromAddress: '01f61a91b5da6e870995aa60ccefee17a38a42823a877343c8d468c971e9ab3d06',
			validator: '0101a458AA2b551C5a49E56326f9BB298bb308e1babc875647aE0290C42F13feac',
			amount: 'casperdash',
			fee: 1,
		});
	} catch (error) {
		expect(error.message).toBe('Failed to get signed stake deploy.');
	}
});
