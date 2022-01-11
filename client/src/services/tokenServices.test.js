import { getTransferTokenDeploy } from './tokenServices';
import { buildTransferTokenDeploy } from './casperServices';
jest.mock('./casperServices', () => {
	return {
		buildTransferTokenDeploy: jest.fn(),
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
	expect(buildTransferTokenDeploy).toHaveBeenCalled();
});

test('getTransferTokenDeploy return error', () => {
	try {
		getTransferTokenDeploy();
	} catch {
		expect(console.error).toHaveBeenCalled();
	}
});
