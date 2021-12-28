import { LEDGER } from '../actionTypes';

export default function ledgerReducer(
	state = {
		casperApp: null,
	},
	action,
) {
	switch (action.type) {
		case LEDGER.SET_LEDGER_OPTIONS:
			return { ...state, casperApp: action.payload.casperApp };
		default:
			return state;
	}
}
