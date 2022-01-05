import { LEDGER } from '../store/actionTypes';

export const setLedgerOptions = (opts) => {
	return {
		type: LEDGER.SET_LEDGER_OPTIONS,
		payload: {
			casperApp: opts.casperApp,
			ledgerKeys: opts.ledgerKeys,
		},
	};
};
