import nftReducer from './nfts';

test('Should return NFTS.UPDATE_LOCAL_STORAGE state', () => {
	expect(nftReducer(undefined, { type: 'NFTS.UPDATE_LOCAL_STORAGE', payload: { test: 'abc' } })).toEqual({
		test: 'abc',
		address: [],
	});
});

test('Should NFTS.GET_DEPLOY_FROM_LOCAL_STORAGE state', () => {
	expect(nftReducer(undefined, { type: 'NFTS.GET_DEPLOY_FROM_LOCAL_STORAGE', payload: { test: 'abc' } })).toEqual({
		test: 'abc',
		address: [],
	});
});

test('Should NFTS.SET_ADDRESS_LOCAL_STORAGE state', () => {
	expect(nftReducer(undefined, { type: 'NFTS.SET_ADDRESS_LOCAL_STORAGE', payload: ['test'] })).toEqual({
		address: ['test'],
	});
});

test('Should NFTS.GET_FROM_LOCAL_STORAGE state', () => {
	expect(nftReducer(undefined, { type: 'NFTS.GET_FROM_LOCAL_STORAGE', payload: ['test'] })).toEqual({
		address: ['test'],
	});
});

test('Should default state', () => {
	expect(nftReducer(undefined, { type: 'NFTS.TEST', payload: ['test'] })).toEqual({
		address: [],
	});
});
