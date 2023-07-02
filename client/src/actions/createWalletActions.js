import { CREATE_WALLET } from '@cd/store/actionTypes';
import { KeyFactory } from 'casper-storage';
import { mnemonicToShares } from '@cd/helpers/shareable';
import { convertKeyphraseToAnswerObject } from './createWalletActions.utils';

/**
 * Generates a keyphrase and dispatches an action to update the keyphrase
 * @param [numOfKey=12] - The number of words in the keyphrase.
 * @returns A function that takes dispatch as an argument and returns
 * dispatch(updateKeyphrase(keyphrase))
 */
const generateKeyphrase = (numOfKey = 12) => {
	const keyManager = KeyFactory.getInstance();

	return (dispatch) => dispatch(updateKeyphrase(keyManager.generate(numOfKey)));
};

const updateKeyphrase = (keyphrase) => {
	return {
		type: CREATE_WALLET.CREATE_KEYPHRASE,
		payload: { keyphrase: mnemonicToShares(keyphrase) },
	};
};

const updateEncryptionType = (encryptionType) => {
	return {
		type: CREATE_WALLET.UPDATE_ENCRYPTION_TYPE,
		payload: { encryptionType },
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

export {
	createAnswerSheet,
	updateAnswerSheet,
	generateKeyphrase,
	resetWalletCreation,
	setNextStep,
	setPrevStep,
	updateKeyphrase,
	updateEncryptionType,
};
