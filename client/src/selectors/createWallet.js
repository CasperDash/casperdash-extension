import { createSelector } from 'reselect';

const createWalletSelector = (state) => state.createWallet;

const makeSelectCreateWallet = (state) => state;
const selectCreateWalletState = createSelector(createWalletSelector, makeSelectCreateWallet);

const makeSelectCWKeyphrase = (state) => state.keyPhrase;
const selectCreateWalletKeyphrase = createSelector(createWalletSelector, makeSelectCWKeyphrase);

const makeSelectCWKeyCurrentStep = (state) => state.currentStep;
const selectCreateWalletCurrentStep = createSelector(createWalletSelector, makeSelectCWKeyCurrentStep);

const makeSelectCWAnswerSheet = (state) => state.answerSheet;
const selectCreateWalletAnswerSheet = createSelector(createWalletSelector, makeSelectCWAnswerSheet);

const makeSelectCWEncryptionType = (state) => state.encryptionType;
const selectCreateWalletEncryptionType = createSelector(createWalletSelector, makeSelectCWEncryptionType);

const makeSelectCWDerivationPath = (state) => state.derivationPath;
const selectCreateWalletDerivationPath = createSelector(createWalletSelector, makeSelectCWDerivationPath);

export {
	makeSelectCreateWallet,
	makeSelectCWKeyphrase,
	makeSelectCWKeyCurrentStep,
	makeSelectCWAnswerSheet,
	makeSelectCWEncryptionType,
	selectCreateWalletState,
	selectCreateWalletKeyphrase,
	selectCreateWalletCurrentStep,
	selectCreateWalletAnswerSheet,
	selectCreateWalletEncryptionType,
	selectCreateWalletDerivationPath,
};
