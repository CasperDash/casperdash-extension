import { getQuerySelector, getMutationSelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { KEY_MANAGER } from '../store/actionTypes';

export const keyManagerDetailsSelector = getQuerySelector({ type: KEY_MANAGER.FETCH_KEY_MANAGER_DETAILS });

export const deploySelector = getMutationSelector({ type: KEY_MANAGER.PUT_WEIGHT_DEPLOY });

export const isKeyManagerContractAvailable = createSelector(keyManagerDetailsSelector, ({ data }) => {
	if (!data || !data.namedKeys || !data.namedKeys.length) {
		return false;
	}
	return data.namedKeys.some((namedKey) => namedKey.name === 'keys_manager');
});
