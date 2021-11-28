import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { VALIDATORS } from '../store/actionTypes';

export const validatorSelector = getQuerySelector({ type: VALIDATORS.FETCH_ACTIVE_VALIDATORS });

export const getValidators = createSelector(validatorSelector, ({ data }) => {
	if (!data) {
		return [];
	}

	return data;
});
