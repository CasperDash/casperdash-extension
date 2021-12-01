import tokensReducer from './tokens';

test('Should return new SET_LOCAL_STORAGE token state', () => {
	expect(tokensReducer(undefined, { type: 'TOKENS.SET_LOCAL_STORAGE', payload: ['test'] })).toEqual({
		address: ['test'],
	});
});

test('Should return new GET_FROM_LOCAL_STORAGE token state', () => {
	expect(tokensReducer({ address: [] }, { type: 'TOKENS.GET_FROM_LOCAL_STORAGE', payload: ['test'] })).toEqual({
		address: ['test'],
	});
});

test('Should return current state', () => {
	expect(tokensReducer({}, { type: 'TOKENS.TEST', payload: 'test' })).toEqual({});
});
