import { CREATE_WALLET } from '@cd/store/actionTypes';
import {
	setNextStep,
	setPrevStep,
	resetWalletCreation,
	updateAnswerSheet,
	createAnswerSheet,
} from './createWalletActions';
import { convertKeyphraseToAnswerObject } from './createWalletActions.utils';

jest.mock('casper-storage', () => ({
	KeyFactory: {
		getInstance: () => ({
			generate: () => 'one two three four five six seven eight nine ten eleven twelve',
		}),
	},
}));

describe('createAnswerSheet', () => {
	it('Should create an answer sheet from selected id keys', () => {
		const idKeys = [1, 3, 5, 9];
		expect(createAnswerSheet(idKeys)).toEqual({
			type: CREATE_WALLET.SET_ANSWER_SHEET,
			payload: convertKeyphraseToAnswerObject(idKeys),
		});
	});
});

describe('updateAnswerSheet', () => {
	it('Should create an action creator which updates answersheet based on passed params', () => {
		expect(updateAnswerSheet(1, true)).toEqual({
			type: CREATE_WALLET.UPDATE_ANSWER_SHEET,
			payload: {
				groupIdx: 1,
				value: true,
			},
		});
	});
});

describe('resetWalletCreation', () => {
	it('Should create an action which reset Create wallet state', () => {
		expect(resetWalletCreation()).toEqual({
			type: CREATE_WALLET.RESET,
		});
	});
});

describe('setNextStep', () => {
	it('Should create an action which set next step in Create Wallet', () => {
		expect(setNextStep()).toEqual({
			type: CREATE_WALLET.NEXT_STEP,
		});
	});
});

describe('setPrevStep', () => {
	it('Should create an action which set previous step in Create Wallet', () => {
		expect(setPrevStep()).toEqual({
			type: CREATE_WALLET.PREVIOUS_STEP,
		});
	});
});
