/* eslint-disable complexity */
import React, { useEffect, useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import _get from 'lodash/get';
import { fetchAccountDelegation, getValidatorsDetails } from '@cd/actions/userActions';
import SelectValidator from '@cd/common/SelectValidator';
import { getAccountDelegation, getMassagedUserDetails, getPublicKey } from '@cd/selectors/user';
import { fetchValidators } from '@cd/actions/stakeActions';
import { toFormattedNumber } from '@cd/helpers/format';
import { validateStakeForm } from '@cd/helpers/validator';
import { getConfigKey } from '@cd/services/configurationServices';
import { ENTRY_POINT_DELEGATE } from '@cd/constants/key';
import { StakingInfo } from './StakingGrid/StakingInfo';

import './Staking.scss';

const Staking = () => {
	// Hook
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { state } = useLocation();
	const { validator = {}, amount: defaultAmount = 0 } = state || {};

	// State
	const [amount, setAmount] = useState(defaultAmount);
	const [firstLoad, setFirstLoad] = useState(true);

	// Selector
	const publicKey = useSelector(getPublicKey);
	const accountDelegation = useSelector(getAccountDelegation());
	const userDetails = useSelector(getMassagedUserDetails);
	const balance = userDetails && userDetails.balance && userDetails.balance.displayBalance;

	// Effect
	useEffect(() => {
		dispatch(fetchValidators(publicKey));
		dispatch(fetchAccountDelegation(publicKey));
		dispatch(getValidatorsDetails());
	}, [dispatch, publicKey]);

	useEffect(() => {
		validator.validatorPublicKey && setFirstLoad(false);
	}, [validator.validatorPublicKey]);

	// Function
	const onSearchValidator = () => {
		navigate('/searchValidator', { state: { name: 'Select Validator' } });
	};

	const formErrors = useMemo(() => {
		if (firstLoad) {
			return {};
		}
		const validatorError = validator.validatorPublicKey ? {} : { validator: 'Required.' };
		const hasDelegated = accountDelegation && accountDelegation.find((delegation) => delegation.validatorPublicKey === validator.validatorPublicKey);
		const selectedValidator = {
			...validator,
			hasDelegated,
		};
		return {
			...validateStakeForm({
				amount: amount,
				tokenSymbol: 'CSPR',
				balance,
				fee: getConfigKey('CSPR_AUCTION_DELEGATE_FEE'),
				minAmount:
					selectedValidator && selectedValidator.hasDelegated
						? getConfigKey('MIN_CSPR_TRANSFER')
						: getConfigKey('MIN_CSPR_DELEGATE_TO_NEW_VALIDATOR'),
				selectedValidator,
			}),
			...validatorError,
		};
	}, [amount, balance, firstLoad, validator, accountDelegation]);

	const onAmountChange = (newAmount) => {
		setFirstLoad(false);
		setAmount(parseFloat(newAmount));
	};

	const onStake = () => {
		if (Object.keys(formErrors).length) {
			return;
		}
		navigate('/stakeConfirm', {
			state: {
				name: 'Delegate',
				stake: {
					action: ENTRY_POINT_DELEGATE,
					validator: {
						publicKey: _get(validator, 'validatorPublicKey'),
						name: _get(validator, 'name'),
						icon: _get(validator, 'icon[1]'),
					},
					amount,
					fee: getConfigKey('CSPR_AUCTION_DELEGATE_FEE')
				},
			},
		});
	};

	return (
		<section className="cd_we_staking">
			<div className="cd_we_staking_inputs">
				<div className="cd_we_staking_validator">
					<div className="cd_we_staking_validator_header">
						<div className="cd_we_input_label">Validator</div>
						<div className="cd_we_input_network_fee">
							Network Fee: {getConfigKey('CSPR_AUCTION_DELEGATE_FEE')} CSPR
						</div>
					</div>
					<div className="cd_we_staking_validator_box">
						<SelectValidator
							name={validator?.name}
							publicKey={validator?.validatorPublicKey}
							icon={_get(validator, 'icon[1]', '')}
							onClick={onSearchValidator}
						/>
					</div>
					<div className="cd_error_text">{formErrors.validator}</div>
				</div>
				<div className="cd_we_staking_amount">
					<div className="cd_we_staking_amount_header">
						<div className="cd_we_input_label">Amount</div>
						<div>Balance: {toFormattedNumber(balance)}</div>
					</div>
					<div className="cd_we_staking_amount_text_box">
						<input type="number" value={amount} onChange={(e) => onAmountChange(e.target.value)} />
						<div
							className="cd_we_amount_max_btn"
							onClick={() => onAmountChange(balance - getConfigKey('CSPR_AUCTION_DELEGATE_FEE'))}
						>
							Max
						</div>
					</div>
					<div className="cd_error_text">{formErrors.amount}</div>
				</div>
				<Button onClick={onStake} disabled={Object.keys(formErrors).length || firstLoad}>
					Stake Now
				</Button>
			</div>

			<StakingInfo publicKey={publicKey} />
		</section>
	);
};

export default Staking;
