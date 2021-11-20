import { isValidPublicKey, validateTransferForm } from './validator';

describe('isValidPublicKey', () => {
	test('valid public key', () => {
		expect(isValidPublicKey('0111a5aee38d7506ae9199e62c30b8303298a38ca7e9835545772f21414ea019b0')).toEqual(true);
		expect(isValidPublicKey('020294d5df03d43206bc9e094c614195234ba0e90013004c9164d1d5d081e014bde8')).toEqual(true);
	});
	test('invalid public key', () => {
		expect(isValidPublicKey('0111a5aee38d7506ae9199e62c30b8303298a3')).toEqual(false);
		expect(isValidPublicKey('020294d5df03d43206bc9e094c614195234ba0')).toEqual(false);
	});
});

describe('validateTransferForm', () => {
	test('To address is required', () => {
		expect(validateTransferForm({})).toEqual({ toAddress: 'Required.' });
	});
	test('Invalid to address', () => {
		expect(validateTransferForm({ toAddress: 'test' })).toEqual({ toAddress: 'Invalid address.' });
	});
	test('Send amount must be at least min amount', () => {
		expect(
			validateTransferForm({
				toAddress: '0111a5aee38d7506ae9199e62c30b8303298a38ca7e9835545772f21414ea019b0',
				sendAmount: 2,
				minAmount: 2.5,
				tokenSymbol: 'CSPR',
			}),
		).toEqual({ sendAmount: 'Amount must be at least 2.5 CSPR.' });
	});
	test('Not enough balance', () => {
		expect(
			validateTransferForm({
				toAddress: '0111a5aee38d7506ae9199e62c30b8303298a38ca7e9835545772f21414ea019b0',
				sendAmount: 100,
				displayBalance: 10,
				tokenSymbol: 'CDAS',
			}),
		).toEqual({ sendAmount: 'Not enough balance.' });
	});
	test('Not enough CSPR balance', () => {
		expect(
			validateTransferForm({
				toAddress: '0111a5aee38d7506ae9199e62c30b8303298a38ca7e9835545772f21414ea019b0',
				sendAmount: 10,
				transferFee: 1,
				displayBalance: 10,
				tokenSymbol: 'CSPR',
			}),
		).toEqual({ sendAmount: 'Not enough balance.' });
	});
	test('Not enough CSPR balance', () => {
		expect(
			validateTransferForm({
				toAddress: '0111a5aee38d7506ae9199e62c30b8303298a38ca7e9835545772f21414ea019b0',
				sendAmount: 10,
				transferFee: 1,
				displayBalance: 10,
				tokenSymbol: 'CSPR',
			}),
		).toEqual({ sendAmount: 'Not enough balance.' });
	});
	test('Not enough transfer fee', () => {
		expect(
			validateTransferForm({
				toAddress: '0111a5aee38d7506ae9199e62c30b8303298a38ca7e9835545772f21414ea019b0',
				sendAmount: 10,
				transferFee: 1,
				displayBalance: 10,
				tokenSymbol: 'CDAS',
				csprBalance: 0.5,
			}),
		).toEqual({ transferFee: 'Not enough CSPR balance.' });
	});
	test('Valid transfer', () => {
		expect(
			validateTransferForm({
				toAddress: '0111a5aee38d7506ae9199e62c30b8303298a38ca7e9835545772f21414ea019b0',
				sendAmount: 10,
				transferFee: 1,
				displayBalance: 10,
				tokenSymbol: 'CDAS',
				csprBalance: 100,
			}),
		).toEqual({});
	});
});
