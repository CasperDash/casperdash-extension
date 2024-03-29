import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getValidators, validatorSelector } from '@cd/selectors/validator';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';
import Grid from '@cd/web-extension/Common/Grid';
import { FeeComponent } from './ValidatorFee';

import './SearchValidator.scss';

const VALIDATOR_METADATA = {
	left: [
		{ key: 'name', type: 'primary', wrapperComponent: MiddleTruncatedText },
		{ key: 'validatorPublicKey', type: 'primary', wrapperComponent: MiddleTruncatedText },
	],
	right: [
		{
			key: 'delegationRate',
			format: 'percentage',
			component: FeeComponent,
			tooltip:
				'This commission rate represents the percentage of the reward that the node operator retains for their services. For instance, a rate of 100% means the validator keeps all of the rewards, leaving zero to the delegators',
		},
		{ key: 'totalStaked', format: 'mote' },
	],
};

export const SearchValidator = () => {
	// State
	const [searchTerm, setSearchTerm] = useState();

	// Selector
	const validators = useSelector(getValidators(searchTerm));
	const { loading } = useSelector(validatorSelector);

	// Hook
	const { state } = useLocation();
	const navigate = useNavigate();

	const filteredValidator = useMemo(() => {
		if (!validators) {
			return validators;
		}

		if (!state.excludedValidators) {
			return validators;
		}

		return validators.filter((validator) => state.excludedValidators.indexOf(validator.validatorPublicKey) === -1);
	}, [state.excludedValidators, validators]);

	// Function
	const onValidatorClick = (validator) => {
		const { callback = '/staking' } = state || {};
		navigate(callback, {
			state: {
				...state,
				validator,
			},
		});
	};

	return (
		<section className="cd_we_validator_search">
			<div className="cd_we_validator_search_input">
				<div className="cd_we_input_label">Validator</div>
				<input
					placeholder="Enter validator"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
			<div className="cd_we_validator_list">
				<div className="cd_we_input_label">Validator List ({filteredValidator.length})</div>
				<Grid
					data={filteredValidator}
					isVirtualList
					metadata={VALIDATOR_METADATA}
					className="overflow_auto"
					onRowClick={onValidatorClick}
					isLoading={loading}
				/>
			</div>
		</section>
	);
};
