import { EncryptionType } from 'casper-storage';
import { CREATE_WALLET } from '../actionTypes';
import { DERIVATION_PATHS } from '@cd/constants/derivationPaths';

const initialState = {
	currentStep: 0,
	keyPhrase: null,
	answerSheet: undefined,
	encryptionType: EncryptionType.Ed25519,
	derivationPath: DERIVATION_PATHS.CASPERDASH,
};

function reducer(state = initialState, { payload, type } = {}) {
	switch (type) {
		case CREATE_WALLET.NEXT_STEP:
			return {
				...state,
				currentStep: state.currentStep + 1,
			};
		case CREATE_WALLET.PREVIOUS_STEP:
			return {
				...state,
				currentStep: state.currentStep - 1,
			};
		case CREATE_WALLET.RESET_STEP:
			return {
				...state,
				currentStep: 0,
			};
		case CREATE_WALLET.CREATE_KEYPHRASE:
			return {
				...state,
				keyPhrase: payload.keyphrase,
			};
		case CREATE_WALLET.RESET:
			return initialState;
		case CREATE_WALLET.SET_ANSWER_SHEET:
			return {
				...state,
				answerSheet: payload,
			};
		case CREATE_WALLET.UPDATE_ANSWER_SHEET:
			return {
				...state,
				answerSheet: {
					...state.answerSheet,
					[payload.groupIdx]: payload.value,
				},
			};
		case CREATE_WALLET.UPDATE_ENCRYPTION_TYPE:
			return {
				...state,
				encryptionType: payload.encryptionType,
			};
		case CREATE_WALLET.UPDATE_DERIVATION_PATH:
			return {
				...state,
				derivationPath: payload.derivationPath,
			};
		default:
			return state;
	}
}

export { initialState };
export default reducer;
