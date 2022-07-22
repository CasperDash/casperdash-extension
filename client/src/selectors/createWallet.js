import { createSelector } from "reselect";

const createWalletSelector = state => state.createWallet;

const makeSelectCreateWallet = state => state;
const selectCreateWalletState = createSelector(
	createWalletSelector,
  makeSelectCreateWallet
);

const makeSelectCWKeyphrase = state => state.keyPhrase;
const selectCreateWalletKeyphrase = createSelector(
	createWalletSelector,
  makeSelectCWKeyphrase
);

const makeSelectCWKeyphraseAsMap = state => state.keyPhraseAsMap;
const selectCreateWalletKeyphraseAsMap = createSelector(
	createWalletSelector,
  makeSelectCWKeyphraseAsMap
);

const makeSelectCWKeyCurrentStep = state => state.currentStep;
const selectCreateWalletCurrentStep = createSelector(
	createWalletSelector,
  makeSelectCWKeyCurrentStep
);

const makeSelectCWAnswerSheet = state => state.answerSheet;
const selectCreateWalletAnswerSheet = createSelector(
	createWalletSelector,
  makeSelectCWAnswerSheet
);

const makeSelectCWTotalKeywords = state => state.totalKeywords;
const selectCreateWalletTotalKeywords = createSelector(
	createWalletSelector,
  makeSelectCWTotalKeywords
);

const makeSelectCWTotalWordsForChecking = state => state.totalWordCheck;
const selectCreateWalletTotalWordsForChecking = createSelector(
	createWalletSelector,
  makeSelectCWTotalWordsForChecking
);

export {
  makeSelectCreateWallet,
  makeSelectCWKeyphrase,
  makeSelectCWKeyphraseAsMap,
  makeSelectCWKeyCurrentStep,
  makeSelectCWAnswerSheet,
  makeSelectCWTotalKeywords,
  makeSelectCWTotalWordsForChecking,
  selectCreateWalletState,
  selectCreateWalletKeyphrase,
  selectCreateWalletKeyphraseAsMap,
  selectCreateWalletCurrentStep,
  selectCreateWalletAnswerSheet,
  selectCreateWalletTotalKeywords,
  selectCreateWalletTotalWordsForChecking
}
