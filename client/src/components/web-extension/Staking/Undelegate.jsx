import React, { useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMassagedUserDetails } from '../../../selectors/user';
import { MiddleTruncatedText } from '../../Common/MiddleTruncatedText';
import { toFormattedNumber } from '../../../helpers/format';
import { CSPR_AUCTION_UNDELEGATE_FEE, MIN_CSPR_TRANSFER } from '../../../constants/key';
import { validateUndelegateForm } from '../../../helpers/validator';
import './Undelegate.scss';

export const Undelegate = () => {
	// Hook
	const navigate = useNavigate();
	const { state } = useLocation();
	const { validator, stakedAmount = 0 } = state || {};

	// Selector
	const userDetails = useSelector(getMassagedUserDetails);
	const balance = userDetails && userDetails.balance && userDetails.balance.displayBalance;

	// State
	const [amount, setAmount] = useState(0);
	const [firstLoad, setFirstLoad] = useState(true);

	const formErrors = useMemo(() => {
		if (firstLoad) {
			return {};
		}
		const validatorError = validator ? {} : { validator: 'Required.' };
		return {
			...validateUndelegateForm({
				amount: amount,
				tokenSymbol: 'CSPR',
				balance,
				fee: CSPR_AUCTION_UNDELEGATE_FEE,
				minAmount: MIN_CSPR_TRANSFER,
			}),
			...validatorError,
		};
	}, [amount, balance, validator, firstLoad]);

	const onAmountChange = (newAmount) => {
		setFirstLoad(false);
		setAmount(parseFloat(newAmount));
	};

	const onUndelegate = () => {
		if (Object.keys(formErrors).length) {
			return;
		}
		navigate('/stakeConfirm', {
			state: {
				name: 'Undelegate',
				stake: { validator: validator, amount, fee: CSPR_AUCTION_UNDELEGATE_FEE, action: 'undelegate' },
			},
		});
	};

	return (
		<section className="cd_we_undelegate cd_we_single_section no_bottom_bar">
			<div className="cd_we_staking_validator">
				<div className="cd_we_staking_validator_header">
					<div className="cd_we_input_label">Validator</div>
					<div className="cd_we_input_network_fee">Network Fee: {CSPR_AUCTION_UNDELEGATE_FEE} CSPR</div>
				</div>
				<div className="cd_we_staking_validator_box">
					<div className="cd_we_staking_validator_value">
						<MiddleTruncatedText>{validator}</MiddleTruncatedText>
					</div>
				</div>
				<div className="cd_error_text">{formErrors.validator}</div>
			</div>
			<div className="cd_we_staking_amount">
				<div className="cd_we_staking_amount_header">
					<div className="cd_we_input_label">Amount</div>
					<div>My staked: {toFormattedNumber(stakedAmount)}</div>
				</div>
				<div className="cd_we_staking_amount_text_box">
					<input type="number" value={amount} onChange={(e) => onAmountChange(e.target.value)} />
					<div className="cd_we_amount_max_btn" onClick={() => onAmountChange(stakedAmount)}>
						Max
					</div>
				</div>
				<div className="cd_error_text">{formErrors.amount}</div>
			</div>
			<Button onClick={onUndelegate} disabled={Object.keys(formErrors).length || firstLoad}>
				Confirm
			</Button>
		</section>
	);
};
