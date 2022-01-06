import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getValidators, validatorSelector } from '../../../../selectors/validator';
import { MiddleTruncatedText } from '../../../Common/MiddleTruncatedText';
import Grid from '../../Common/Grid';
import './SearchValidator.scss';

const VALIDATOR_METADATA = {
	left: [{ key: 'public_key', type: 'primary', wrapperComponent: MiddleTruncatedText }],
	right: [
		{ key: 'bidInfo.bid.delegation_rate', format: 'percentage', suffix: 'Fee' },
		{ key: 'bidInfo.bid.staked_amount', format: 'mote', suffix: 'CSPR' },
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

	// Function
	const onValidatorClick = (validator) => {
		navigate('/staking', { state: { ...state, validator } });
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
				<div className="cd_we_input_label">Validator List</div>
				<Grid
					data={validators}
					metadata={VALIDATOR_METADATA}
					className="overflow_auto hide_scroll_bar"
					onRowClick={onValidatorClick}
					isLoading={loading}
				/>
			</div>
		</section>
	);
};
