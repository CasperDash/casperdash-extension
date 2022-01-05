import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { toFormattedNumber } from '../../../helpers/format';
import Copy from '../../Common/Button/Copy';
import './Confirm.scss';

export const Confirm = () => {
	// Hook
	const { state } = useLocation();
	const { stake = {} } = state || {};

	return (
		<section className="cd_we_deploy_details cd_we_single_section no_bottom_bar">
			<div className="cd_we_confirm_row">
				<div className="cd_we_input_label">Validator</div>
				<div className="cd_we_stake_validator_address">
					{stake.validator} <Copy value={stake.validator} />
				</div>
			</div>
			<div className="cd_we_confirm_row">
				<div className="cd_we_input_label">Amount</div>
				<div>{toFormattedNumber(stake.amount)} CSPR</div>
			</div>
			<div className="cd_we_confirm_row">
				<div className="cd_we_input_label">Network Fee</div>
				<div>{toFormattedNumber(stake.fee)} CSPR</div>
			</div>
			<Button>{stake.action === 'undelegate' ? 'Undelegate' : 'Delegate'}</Button>
		</section>
	);
};
