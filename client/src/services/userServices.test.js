import { getSignedTransferDeploy } from './userServices';
import { getTransferDeploy, signDeploy } from './casperServices';
jest.mock('./casperServices', () => {
	return {
		getTransferDeploy: jest.fn(),
		signDeploy: jest.fn(),
	};
});

test('getSignedTransferDeploy', () => {
	getSignedTransferDeploy({
		fromAddress: '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad',
		toAddress: '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad',
		amount: 10000,
		transferId: 0,
		fee: 1,
	});
	expect(getTransferDeploy).toHaveBeenCalled();
	expect(signDeploy).toHaveBeenCalled();
});

test('getSignedTransferDeploy return error', () => {
	let value;
	try {
		value = getSignedTransferDeploy();
	} catch {
		expect(Boolean(value.error)).toBe(true);
	}
});
