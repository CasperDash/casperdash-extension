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
			<div>
				<div>Validator</div>
				<div>
					{stake.validator} <Copy value={stake.validator} />
				</div>
			</div>
			<div>
				<div>Amount</div>
				<div>{toFormattedNumber(stake.amount)} </div>
			</div>
			<div>
				<div>Network Fee</div>
				<div>{toFormattedNumber(state.fee)}</div>
			</div>
			<Button>{stake.action === 'undelegate' ? 'Undelegate' : 'Delegate'}</Button>
		</section>
	);
};
