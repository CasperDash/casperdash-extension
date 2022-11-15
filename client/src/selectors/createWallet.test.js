import {
	makeSelectCreateWallet,
	makeSelectCWKeyphrase,
	makeSelectCWKeyphraseAsMap,
	makeSelectCWKeyCurrentStep,
	makeSelectCWAnswerSheet,
} from './createWallet';

describe('Create Wallet selectors', () => {
	const state = {
		currentStep: 0,
		keyPhrase: 'one two three',
		keyPhraseAsMap: [],
		answerSheet: { 1: true, 3: false },
	};

	it('Should return full create wallet state', () => {
		expect(makeSelectCreateWallet(state)).toEqual(state);
	});

	it('Should return keyphrase', () => {
		expect(makeSelectCWKeyphrase(state)).toEqual('one two three');
	});

	it('Should return keyphrase as Map instace', () => {
		expect(makeSelectCWKeyphraseAsMap(state)).toEqual([]);
	});

	it('Should return current step ', () => {
		expect(makeSelectCWKeyCurrentStep(state)).toEqual(0);
	});

	it('Should return answer sheet', () => {
		expect(makeSelectCWAnswerSheet(state)).toEqual({ 1: true, 3: false });
	});
});
