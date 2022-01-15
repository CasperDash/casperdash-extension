import { getConfigurations } from './configurationActions';

test('getConfigurations', () => {
	expect(getConfigurations()).toEqual({
		type: 'CONFIGURATIONS.FETCH_CONFIGURATIONS',
		request: {
			url: '/configurations',
		},
	});
});
