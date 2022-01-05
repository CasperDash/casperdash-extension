import { LEDGER } from '../actionTypes';

export default function ledgerReducer(
	state = {
		casperApp: null,
		ledgerKeys: [],
		keyPath: 0,
	},
	action,
) {
	switch (action.type) {
		case LEDGER.SET_LEDGER_OPTIONS:
			return {
				...state,
				casperApp: action.payload.casperApp,
				ledgerKeys: action.payload.ledgerKeys,
				keyPath: action.payload.keyPath,
			};
		case LEDGER.SET_KEY_PATH:
			return {
				...state,
				keyPath: action.payload.keyPath,
			};
		default:
			return state;
	}
}
