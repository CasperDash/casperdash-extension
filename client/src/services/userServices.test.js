import { getTransferDeploy } from './userServices';
import { buildTransferDeploy } from './casperServices';
jest.mock('./casperServices', () => {
	return {
		buildTransferDeploy: jest.fn(),
		signDeploy: jest.fn(),
	};
});

test('getTransferDeploy', () => {
	getTransferDeploy({
		fromAddress: '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad',
		toAddress: '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad',
		amount: 10000,
		transferId: 0,
		fee: 1,
	});
	expect(buildTransferDeploy).toHaveBeenCalled();
});

test('getTransferDeploy return error', () => {
	try {
		getTransferDeploy();
	} catch (error) {
		expect(console.error).toHaveBeenCalled();
		expect(error.message).toBe('Failed to build transfer deploy.');
	}
});
