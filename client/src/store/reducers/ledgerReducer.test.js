import ledgerReducer from './ledgerReducer';

test('Should return LEDGER.SET_LEDGER_OPTIONS ledger state', () => {
	expect(
		ledgerReducer(undefined, {
			type: 'LEDGER.SET_LEDGER_OPTIONS',
			payload: { casperApp: { key: 1 }, ledgerKeys: ['0x123', '0x456'], keyPath: 1 },
		}),
	).toEqual({ casperApp: { key: 1 }, ledgerKeys: ['0x123', '0x456'], keyPath: 1 });
});

test('Should return LEDGER.SET_KEY_PATH keypath state', () => {
	expect(
		ledgerReducer(undefined, {
			type: 'LEDGER.SET_KEY_PATH',
			payload: { keyPath: 2 },
		}),
	).toEqual({ casperApp: null, ledgerKeys: [], keyPath: 2 });
});

test('Should return current state', () => {
	expect(ledgerReducer(undefined, { type: 'LEDGER.TEST', payload: { test: 'abc' } })).toEqual({
		casperApp: null,
		keyPath: 0,
		ledgerKeys: [],
	});
});
