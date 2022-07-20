import { CREATE_WALLET } from '@cd/store/actionTypes';
import { KeyFactory } from "casper-storage";
import { convertKeyphraseToAnswerObject, generateKeyphraseMap } from "./createWalletActions.utils";

/**
 * Generating a keyphrase of 12 words
 * Then convert result into Map object for re-use in word validating
 */
const generateKeyphrase = () => {
  const keyManager = KeyFactory.getInstance();
  const keyphrase = keyManager.generate();

  return {
    type: CREATE_WALLET.CREATE_KEYPHRASE,
    payload: { keyphrase, map: generateKeyphraseMap(keyphrase) }
  }
}

const createAnswerSheet = idKeys => {
  return {
    type: CREATE_WALLET.SET_ANSWER_SHEET,
    payload: convertKeyphraseToAnswerObject(idKeys)
  }
};

const updateAnswerSheet = (groupIdx, value) => {
  return {
    type: CREATE_WALLET.UPDATE_ANSWER_SHEET,
    payload: {
      groupIdx,
      value
    }
  }
};

const resetWalletCreation = () => ({ type: CREATE_WALLET.RESET});
const setNextStep = () => ({ type: CREATE_WALLET.NEXT_STEP});
const setPrevStep = () => ({ type: CREATE_WALLET.PREVIOUS_STEP});

export {
  createAnswerSheet,
  updateAnswerSheet,
  generateKeyphrase,
  resetWalletCreation,
  setNextStep,
  setPrevStep
}
