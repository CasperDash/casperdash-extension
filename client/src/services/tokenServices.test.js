import { getTransferTokenDeploy } from './tokenServices';
import { getTransferTokenDeploy, signDeploy } from './casperServices';
jest.mock('./casperServices', () => {
	return {
		getTransferTokenDeploy: jest.fn(),
		signDeploy: jest.fn(),
	};
});

test('getTransferTokenDeploy', () => {
	getTransferTokenDeploy({
		fromAddress: '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad',
		toAddress: '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad',
		amount: 10000,
		contractInfo: { address: 'test', decimals: 10 },
		fee: 1,
	});
	expect(getTransferTokenDeploy).toHaveBeenCalled();
	expect(signDeploy).toHaveBeenCalled();
});

test('getTransferTokenDeploy return error', () => {
	let value;
	try {
		value = getTransferTokenDeploy();
	} catch {
		expect(Boolean(value.error)).toBe(true);
	}
});
