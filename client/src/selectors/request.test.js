import { isLoadingRequest } from './request';

test('Should return loading status', () => {
	expect(isLoadingRequest({ request: { isLoading: ['test'] } })).toEqual(1);
});
