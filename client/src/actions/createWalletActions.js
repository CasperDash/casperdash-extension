import { CREATE_WALLET } from '@cd/store/actionTypes';
import { KeyFactory } from 'casper-storage';
import { convertKeyphraseToAnswerObject, generateKeyphraseMap } from './createWalletActions.utils';

/**
 * Generating a keyphrase of 12 words
 * Then convert result into Map object for re-use in word validating
 * @returns
 */
const generateKeyphrase = () => {
	const keyManager = KeyFactory.getInstance();
	const keyphrase = keyManager.generate();

	return {
		type: CREATE_WALLET.CREATE_KEYPHRASE,
		payload: { keyphrase, map: generateKeyphraseMap(keyphrase) },
	};
};

/**
 * Ids of selected words for checking
 * @param {Array[Number]} idKeys
 * @returns
 */
const createAnswerSheet = (idKeys) => {
	return {
		type: CREATE_WALLET.SET_ANSWER_SHEET,
		payload: convertKeyphraseToAnswerObject(idKeys),
	};
};

/**
 * Update selected answer for according word
 * @param {Number} groupIdx
 * @param {Boolean} value
 * @returns
 */
const updateAnswerSheet = (groupIdx, value) => {
	return {
		type: CREATE_WALLET.UPDATE_ANSWER_SHEET,
		payload: {
			groupIdx,
			value,
		},
	};
};

/**
 * Reset Create Wallet state when User clicks Back
 * @returns
 */
const resetWalletCreation = () => ({ type: CREATE_WALLET.RESET });

/**
 * Proceed Create Wallet step to next step
 * @returns
 */
const setNextStep = () => ({ type: CREATE_WALLET.NEXT_STEP });

/**
 * Navigate User to beginning step of Create Wallet phases
 * @returns
 */
const setPrevStep = () => ({ type: CREATE_WALLET.PREVIOUS_STEP });

const setEncryptionType = value => ({ type: CREATE_WALLET.SET_ENCRYPTION_TYPE, payload: value });

export { setEncryptionType, createAnswerSheet, updateAnswerSheet, generateKeyphrase, resetWalletCreation, setNextStep, setPrevStep };
