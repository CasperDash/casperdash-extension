import requestReducer from './request';

test('Should return new ADD_REQUEST_LOADING_STATUS request state', () => {
	expect(requestReducer(undefined, { type: 'REQUEST.ADD_REQUEST_LOADING_STATUS', payload: 'loading' })).toEqual({
		isLoading: ['loading'],
	});
});

test('Should return new REMOVE_REQUEST_LOADING_STATUS request state', () => {
	expect(
		requestReducer(
			{ isLoading: ['test1', 'test2', 'test3'] },
			{ type: 'REQUEST.REMOVE_REQUEST_LOADING_STATUS', payload: 'test2' },
		),
	).toEqual({
		isLoading: ['test1', 'test3'],
	});
});

test('Should return current state', () => {
	expect(requestReducer({ isLoading: [] }, { type: 'REQUEST.TEST', payload: 'loading' })).toEqual({ isLoading: [] });
});
