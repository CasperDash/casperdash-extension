import {
	isValidPublicKey,
	validateTransferForm,
	validateStakeForm,
	validateUndelegateForm,
	validateNFTMintForm,
	validateNftTransferForm,
} from './validator';

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
	test('Send amount must be more than zero', () => {
		expect(
			validateTransferForm({
				toAddress: '0111a5aee38d7506ae9199e62c30b8303298a38ca7e9835545772f21414ea019b0',
				sendAmount: -1,
				minAmount: -2,
				tokenSymbol: 'CSPR',
			}),
		).toEqual({ sendAmount: 'Amount must be more than 0 CSPR.' });
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

describe('validateStakeForm', () => {
	test('Send amount must be more than zero', () => {
		expect(
			validateStakeForm({
				amount: -1,
				tokenSymbol: 'CSPR',
				balance: 3,
				fee: 5,
				minAmount: 0.0001,
			}),
		).toEqual({ amount: 'Amount must be more than 0 CSPR.' });
	});

	test('Not enough balance with fee', () => {
		expect(
			validateStakeForm({
				amount: 1,
				tokenSymbol: 'CSPR',
				balance: 3,
				fee: 5,
				minAmount: 0.0001,
			}),
		).toEqual({ amount: 'Insufficient balance to complete the transaction. Please add funds to your account and try again.' });
	});

	test('Not enough balance', () => {
		expect(
			validateStakeForm({
				amount: 1,
				tokenSymbol: 'CSPR',
				balance: 6,
				fee: 5,
				minAmount: 7,
			}),
		).toEqual({ amount: 'Please note that the minimum amount for your staking is 7 CSPR or more. Please adjust your amount and try again.' });
	});
});

describe('validateUndelegateForm', () => {
	test('Amount must be more than zero', () => {
		expect(
			validateUndelegateForm({
				amount: -1,
				tokenSymbol: 'CSPR',
				balance: 3,
				fee: 5,
				minAmount: 0.0001,
			}),
		).toEqual({ amount: 'Amount must be more than 0 CSPR.' });
	});

	test('Amount must be less or equal than staked amount', () => {
		expect(
			validateUndelegateForm({
				amount: 3,
				tokenSymbol: 'CSPR',
				balance: 5,
				fee: 0.00001,
				minAmount: 0.0001,
				stakedAmount: 2,
			}),
		).toEqual({ amount: 'Not enough staked amount.' });
	});

	test('Not enough balance', () => {
		expect(
			validateUndelegateForm({
				amount: 1,
				tokenSymbol: 'CSPR',
				balance: 4,
				fee: 4.5,
				minAmount: 2.5,
				stakedAmount: 2,
			}),
		).toEqual({ amount: 'Insufficient balance to complete the transaction. Please add funds to your account and try again.' });
	});

	test('Not enough minimum balance', () => {
		expect(
			validateUndelegateForm({
				amount: 1,
				tokenSymbol: 'CSPR',
				balance: 4,
				fee: 4.5,
				minAmount: 5,
				stakedAmount: 2,
			}),
		).toEqual({ amount: 'Insufficient balance. System requires 5 CSPR minimum balance.' });
	});
});

describe('validateNFTMintForm', () => {
	test('Should return no error', () => {
		expect(validateNFTMintForm({ nftContract: 'test', name: 'test', image: 'test', toAddress: '' })).toEqual({});
	});
	test('Should return required error', () => {
		expect(validateNFTMintForm({ nftContract: '', name: '', toAddress: '' })).toEqual({
			image: 'Required',
			name: 'Required',
			nftContract: 'Required',
		});
	});
	test('Should return image error', () => {
		expect(validateNFTMintForm({ nftContract: 'test', name: 'test', image: { type: 'test' } })).toEqual({
			image: 'Should be image.',
		});
	});
	test('Should return to address error', () => {
		expect(
			validateNFTMintForm({ nftContract: 'test', name: 'test', image: { type: 'image' }, toAddress: 'test' }),
		).toEqual({
			toAddress: 'Invalid address.',
		});
	});

	test('Should return to attribute error', () => {
		expect(
			validateNFTMintForm({
				nftContract: 'test',
				name: 'test',
				image: { type: 'image' },

				attribute1: '123123123123123123123123123123123123123123',
				value1: '123123123123123123123123123123123123123123',
			}),
		).toEqual({
			attribute1: 'Max is 20 chars.',
			value1: 'Max is 20 chars.',
		});
	});
});

describe('validateNftTransferForm', () => {
	test('Should return no error', () => {
		expect(
			validateNftTransferForm({
				toAddress: '0111a5aee38d7506ae9199e62c30b8303298a38ca7e9835545772f21414ea019b0',
			}),
		).toEqual({});
	});

	test('Should return required address error', () => {
		expect(
			validateNftTransferForm({
				toAddress: '',
			}),
		).toEqual({
			toAddress: 'Required',
		});
	});

	test('Should return invalid address error', () => {
		expect(
			validateNftTransferForm({
				toAddress: '0x11',
			}),
		).toEqual({
			toAddress: 'Invalid address.',
		});
	});
});
