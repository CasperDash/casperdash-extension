import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import Fuse from 'fuse.js';
import memoizeOne from 'memoize-one';
import { VALIDATORS } from '../store/actionTypes';

export const validatorSelector = getQuerySelector({ type: VALIDATORS.FETCH_ACTIVE_VALIDATORS });

const searchValidator = memoizeOne((validators, searchTerm) => {
	if (!searchTerm) {
		return validators;
	}
	const fuse = new Fuse(validators, { keys: ['public_key'], threshold: 0.1 });
	return fuse.search(searchTerm).map((result) => result.item);
});

export const getValidators = (searchTerm) =>
	createSelector(validatorSelector, ({ data }) => {
		if (!data) {
			return [];
		}

		return searchValidator(data, searchTerm);
	});
