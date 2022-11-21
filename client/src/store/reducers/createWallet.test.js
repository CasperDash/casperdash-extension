import { EncryptionType } from 'casper-storage';
import { CREATE_WALLET } from '../actionTypes';
import reducer from './createWallet';

describe('Create Wallet reducer', () => {
	let initState = undefined;
	const reset = () => ({
		currentStep: 2,
		keyPhrase: null,
		keyPhraseAsMap: [],
		answerSheet: undefined,
		encryptionType: EncryptionType.Ed25519,
	});
	beforeEach(() => {
		initState = reset();
	});
	afterEach(() => {
		initState = reset();
	});
	it('Should return CREATE_WALLET.NEXT_STEP state', () => {
		expect(
			reducer(initState, {
				type: CREATE_WALLET.NEXT_STEP,
			}),
		).toEqual({
			...initState,
			currentStep: 3,
		});
	});

	it('Should return CREATE_WALLET.PREVIOUS_STEP state', () => {
		expect(
			reducer(initState, {
				type: CREATE_WALLET.PREVIOUS_STEP,
			}),
		).toEqual({
			...initState,
			currentStep: 1,
		});
	});

	it('Should return CREATE_WALLET.RESET_STEP state', () => {
		expect(
			reducer(initState, {
				type: CREATE_WALLET.RESET_STEP,
			}),
		).toEqual({ ...initState, currentStep: 0 });
	});

	it('Should return CREATE_WALLET.CREATE_KEYPHRASE state', () => {
		expect(
			reducer(initState, {
				type: CREATE_WALLET.CREATE_KEYPHRASE,
				payload: {
					keyphrase: 'abc def',
					map: {},
				},
			}),
		).toEqual({
			...initState,
			keyPhrase: 'abc def',
			keyPhraseAsMap: {},
		});
	});

	it('Should return CREATE_WALLET.RESET state', () => {
		expect(
			reducer(initState, {
				type: CREATE_WALLET.RESET,
			}),
		).toEqual({ ...initState, currentStep: 0 });
	});

	it('Should return CREATE_WALLET.SET_ANSWER_SHEET state', () => {
		expect(
			reducer(initState, {
				type: CREATE_WALLET.SET_ANSWER_SHEET,
				payload: {
					1: true,
					3: false,
				},
			}),
		).toEqual({
			...initState,
			answerSheet: {
				1: true,
				3: false,
			},
		});
	});

	it('Should return CREATE_WALLET.UPDATE_ANSWER_SHEET state', () => {
		expect(
			reducer(
				{
					currentStep: 2,
					keyPhrase: null,
					keyPhraseAsMap: [],
					answerSheet: {
						1: true,
						3: null,
					},
				},
				{
					type: CREATE_WALLET.UPDATE_ANSWER_SHEET,
					payload: {
						groupIdx: 3,
						value: true,
					},
				},
			),
		).toEqual({
			currentStep: 2,
			keyPhrase: null,
			keyPhraseAsMap: [],
			answerSheet: {
				1: true,
				3: true,
			},
		});
	});
});
