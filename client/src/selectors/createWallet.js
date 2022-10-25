import { createSelector } from 'reselect';

const createWalletSelector = (state) => state.createWallet;

const makeSelectCreateWallet = (state) => state;
const selectCreateWalletState = createSelector(createWalletSelector, makeSelectCreateWallet);

const makeSelectCWKeyphrase = (state) => state.keyPhrase;
const selectCreateWalletKeyphrase = createSelector(createWalletSelector, makeSelectCWKeyphrase);

const makeSelectCWKeyphraseAsMap = (state) => state.keyPhraseAsMap;
const selectCreateWalletKeyphraseAsMap = createSelector(createWalletSelector, makeSelectCWKeyphraseAsMap);

const makeSelectCWKeyCurrentStep = (state) => state.currentStep;
const selectCreateWalletCurrentStep = createSelector(createWalletSelector, makeSelectCWKeyCurrentStep);

const makeSelectCWAnswerSheet = (state) => state.answerSheet;
const selectCreateWalletAnswerSheet = createSelector(createWalletSelector, makeSelectCWAnswerSheet);

const makeSelectCWEncryptionType = (state) => state.encryptionType;
const selectCreateWalletEncryptionType = createSelector(createWalletSelector, makeSelectCWEncryptionType);

export {
	makeSelectCreateWallet,
	makeSelectCWKeyphrase,
	makeSelectCWKeyphraseAsMap,
	makeSelectCWKeyCurrentStep,
	makeSelectCWAnswerSheet,
	makeSelectCWEncryptionType,
	selectCreateWalletState,
	selectCreateWalletKeyphrase,
	selectCreateWalletKeyphraseAsMap,
	selectCreateWalletCurrentStep,
	selectCreateWalletAnswerSheet,
	selectCreateWalletEncryptionType,
};
