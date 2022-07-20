import { createSelector } from "reselect";

const createWalletSelector = state => state.createWallet;

const selectCreateWalletState = createSelector(
	createWalletSelector,
	state => state
);

const selectCreateWalletKeyphrase = createSelector(
	createWalletSelector,
	state => state.keyPhrase,
);

const selectCreateWalletKeyphraseAsMap = createSelector(
	createWalletSelector,
	state => state.keyPhraseAsMap,
);

const selectCreateWalletCurrentStep = createSelector(
	createWalletSelector,
	state => state.currentStep,
);

const selectCreateWalletAnswerSheet = createSelector(
	createWalletSelector,
	state => state.answerSheet,
);

const selectCreateWalletTotalKeywords = createSelector(
	createWalletSelector,
	state => state.totalKeywords,
);

export {
  selectCreateWalletState,
  selectCreateWalletKeyphrase,
  selectCreateWalletKeyphraseAsMap,
  selectCreateWalletCurrentStep,
  selectCreateWalletAnswerSheet,
  selectCreateWalletTotalKeywords
}
