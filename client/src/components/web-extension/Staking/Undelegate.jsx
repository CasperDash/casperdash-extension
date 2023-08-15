import React, { useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import _get from 'lodash-es/get';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMassagedUserDetails } from '@cd/selectors/user';
import { toFormattedNumber } from '@cd/helpers/format';
import { getConfigKey } from '@cd/services/configurationServices';
import { validateUndelegateForm } from '@cd/helpers/validator';
import SwitchBox from '@cd/common/SwitchBox';
import SelectValidator from '@cd/common/SelectValidator';
import { ENTRY_POINT_REDELEGATE, ENTRY_POINT_UNDELEGATE } from '@cd/constants/key';

import './Undelegate.scss';

export const Undelegate = () => {
	// Hook
	const navigate = useNavigate();
	const { state } = useLocation();

	const {
		validator: newValidator,
		validatorPublicKey,
		stakedAmount = 0,
		validatorName,
		validatorIcon,
		defaultAmount = 0,
		defaultIsUsingRedelegate = false,
	} = state || {};

	// Selector
	const userDetails = useSelector(getMassagedUserDetails);
	const balance = userDetails && userDetails.balance && userDetails.balance.displayBalance;

	// State
	const [amount, setAmount] = useState(defaultAmount);
	const [firstLoad, setFirstLoad] = useState(true);
	const [isUsingRedelegate, setIsUsingRedelegate] = useState(defaultIsUsingRedelegate);

	const formErrors = useMemo(() => {
		if (firstLoad) {
			return {};
		}
		const validatorError = validatorPublicKey ? {} : { validator: 'Required.' };
		return {
			...validateUndelegateForm({
				amount: amount,
				tokenSymbol: 'CSPR',
				balance,
				fee: getConfigKey('CSPR_AUCTION_UNDELEGATE_FEE'),
				minAmount: getConfigKey('MIN_CSPR_TRANSFER'),
			}),
			...validatorError,
		};
	}, [amount, balance, validatorPublicKey, firstLoad]);

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
				name: isUsingRedelegate ? 'Redelegate' : 'Undelegate',
				isUsingRedelegate,
				stake: {
					validator: {
						publicKey: validatorPublicKey,
						name: validatorName,
						icon: validatorIcon,
					},
					amount,
					fee: getConfigKey('CSPR_AUCTION_UNDELEGATE_FEE'),
					action: isUsingRedelegate ? ENTRY_POINT_REDELEGATE : ENTRY_POINT_UNDELEGATE,
					newValidator: {
						publicKey: _get(newValidator, 'validatorPublicKey'),
						name: _get(newValidator,  'name'),
						icon: _get(newValidator, 'icon[1]'),
					}
				},
			},
		});
	};

	const onSearchValidator = () => {
		navigate('/searchValidator', {
			state: {
				...state,
				defaultAmount: amount,
				defaultIsUsingRedelegate: isUsingRedelegate,
				name: 'Select Validator',
				callback: '/undelegate',
			}
		});
	};

	return (
		<section className="cd_we_undelegate cd_we_single_section no_bottom_bar">
			<div className="cd_we_staking_validator">
				<div className="cd_we_staking_validator_header">
					<div className="cd_we_input_label">Validator</div>
					<div className="cd_we_input_network_fee">
						Network Fee: {getConfigKey('CSPR_AUCTION_UNDELEGATE_FEE')} CSPR
					</div>
				</div>
				<div className="cd_we_staking_validator_box">
					<SelectValidator
						publicKey={validatorPublicKey}
						name={validatorName}
						icon={validatorIcon}
						className={'cd_we_staking_validator_box__select'}
						isShowArrow={false}
					/>
				</div>
				<div className="cd_error_text">{formErrors.validator}</div>
			</div>
			<div className="cd_we_staking_redelegate">
				<label className={'cd_we_staking_redelegate__switch-box'}>
					<SwitchBox
						checked={isUsingRedelegate}
						onClick={() => setIsUsingRedelegate(!isUsingRedelegate)}
					/>
					<span className="cd_we_staking_redelegate__switch-box-text">Using redelegate</span>
				</label>
				{
					isUsingRedelegate && (
						<div className="cd_we_staking_redelegate__select-validator">
							<SelectValidator
								publicKey={_get(newValidator, 'validatorPublicKey')}
								name={_get(newValidator, 'name')}
								icon={_get(newValidator, 'icon[1]')}
								onClick={onSearchValidator}
							/>
							<div className="cd_error_text">{formErrors.newValidator}</div>
						</div>
					)
				}
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
