import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import Fuse from 'fuse.js';
import memoizeOne from 'memoize-one';
import { getBase64IdentIcon } from '@cd/helpers/identicon';
import { VALIDATORS } from '@cd/store/actionTypes';

export const validatorSelector = getQuerySelector({ type: VALIDATORS.FETCH_ACTIVE_VALIDATORS });

export const validatorsDetail = getQuerySelector({ type: VALIDATORS.FETCH_VALIDATORS_DETAIL });

const searchValidator = memoizeOne((validators, searchTerm) => {
	if (!searchTerm) {
		return validators;
	}
	const fuse = new Fuse(validators, { keys: ['validatorPublicKey', 'name'], threshold: 0.1 });
	return fuse.search(searchTerm).map((result) => result.item);
});

const addValidatorIconAndName = memoizeOne((validators, details) => {
	return validators.map((validator) => {
		const detail = details?.[validator.validatorPublicKey];
		const icon = detail?.logo || validator.logo || getBase64IdentIcon(validator.validatorPublicKey, { size: 30 });
		return {
			...validator,
			icon: [detail?.priority ? '../assets/images/ic-verified.svg' : '', icon],
			name: detail?.name || validator.name || validator.validatorPublicKey,
		};
	});
});

export const getValidators = (searchTerm) =>
	createSelector(validatorSelector, validatorsDetail, ({ data }, { data: details }) => {
		if (!data) {
			return [];
		}
		const validatorsWithIcon = addValidatorIconAndName(data, details);
		return searchValidator(validatorsWithIcon, searchTerm);
	});
