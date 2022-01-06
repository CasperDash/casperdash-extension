import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import Fuse from 'fuse.js';
import memoizeOne from 'memoize-one';
import { getBase64IdentIcon } from '../helpers/identicon';
import { VALIDATORS } from '../store/actionTypes';

export const validatorSelector = getQuerySelector({ type: VALIDATORS.FETCH_ACTIVE_VALIDATORS });

const searchValidator = memoizeOne((validators, searchTerm) => {
	if (!searchTerm) {
		return validators;
	}
	const fuse = new Fuse(validators, { keys: ['public_key'], threshold: 0.1 });
	return fuse.search(searchTerm).map((result) => result.item);
});

const addValidatorIcon = memoizeOne((validators) => {
	return validators.map((validator) => {
		return { ...validator, icon: getBase64IdentIcon(validator.public_key, { size: 30 }) };
	});
});

export const getValidators = (searchTerm) =>
	createSelector(validatorSelector, ({ data }) => {
		if (!data) {
			return [];
		}
		const validatorsWithIcon = addValidatorIcon(data);
		return searchValidator(validatorsWithIcon, searchTerm);
	});
