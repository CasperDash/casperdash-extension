import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import Fuse from 'fuse.js';
import memoizeOne from 'memoize-one';
import { getBase64IdentIcon } from '@cd/helpers/identicon';
import { VALIDATORS } from '@cd/store/actionTypes';
import priorityIcon from '@cd/assets/image/red-casper.png';

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
		const icon = validator.logo || getBase64IdentIcon(validator.public_key, { size: 30 });
		return {
			...validator,
			icon: [validator.priority ? priorityIcon : '', icon],
		};
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
