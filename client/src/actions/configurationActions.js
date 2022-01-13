import { CONFIGURATIONS } from '../store/actionTypes';

/**
 * Get configurations.
 * @returns dispatch object
 */
export const getConfigurations = () => ({
	type: CONFIGURATIONS.FETCH_CONFIGURATIONS,
	request: {
		url: '/configurations',
	},
});
