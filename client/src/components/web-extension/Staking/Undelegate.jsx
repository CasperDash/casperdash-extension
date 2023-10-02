import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import _get from 'lodash-es/get';
import { useFormik } from 'formik';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { toFormattedNumber } from '@cd/helpers/format';
import { getConfigKey } from '@cd/services/configurationServices';
import SwitchBox from '@cd/common/SwitchBox';
import SelectValidator from '@cd/common/SelectValidator';
import { ENTRY_POINT_REDELEGATE, ENTRY_POINT_UNDELEGATE } from '@cd/constants/key';
import useYupUndelegateValidation from '@cd/hooks/useYupUndelegateValidation';

import './Undelegate.scss';

export const Undelegate = () => {
	// Hook
	const navigate = useNavigate();
	const { state } = useLocation();
	const [, setPrevRoute] = useOutletContext();

	useEffect(() => {
		setPrevRoute('/staking');
	}, [setPrevRoute]);

	const {
		validator: newValidator,
		validatorPublicKey,
		stakedAmount = 0,
		validatorName,
		validatorIcon,
		defaultAmount = 0,
		defaultIsUsingRedelegate = false,
	} = state || {};

	const validationSchema = useYupUndelegateValidation({
		validatorPublicKey,
		selectedValidator: newValidator,
		stakedAmount,
	});

	const formik = useFormik({
		initialValues: {
			validatorPublicKey: validatorPublicKey,
			newValidatorPublicKey: _get(newValidator, 'validatorPublicKey'),
			isUsingRedelegate: defaultIsUsingRedelegate,
			amount: defaultAmount,
		},
		validationSchema,
		onSubmit: (values) => {
			const { isUsingRedelegate } = values;

			navigate('/stakeConfirm', {
				state: {
					name: isUsingRedelegate ? 'Redelegate' : 'Undelegate',
					isUsingRedelegate: isUsingRedelegate,
					stake: {
						validator: {
							publicKey: values.validatorPublicKey,
							name: validatorName,
							icon: validatorIcon,
						},
						amount: formik.values.amount,
						fee: getConfigKey('CSPR_AUCTION_UNDELEGATE_FEE'),
						action: isUsingRedelegate ? ENTRY_POINT_REDELEGATE : ENTRY_POINT_UNDELEGATE,
						newValidator: {
							publicKey: values.newValidatorPublicKey,
							name: _get(newValidator, 'name'),
							icon: _get(newValidator, 'icon[1]'),
						},
					},
				},
			});
		},
	});

	const onAmountChange = (newAmount) => {
		formik.setFieldValue('amount', parseFloat(newAmount));
	};

	const onSearchValidator = () => {
		navigate('/searchValidator', {
			state: {
				...state,
				defaultAmount: formik.values.amount,
				defaultIsUsingRedelegate: formik.values.isUsingRedelegate,
				name: 'Select Validator',
				callback: '/undelegate',
				excludedValidators: [formik.values.validatorPublicKey],
			},
		});
	};

	useEffect(() => {
		if (newValidator) {
			formik.validateField('newValidatorPublicKey');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<section className="cd_we_undelegate cd_we_single_section no_bottom_bar">
			<form onSubmit={formik.handleSubmit}>
				<div className="cd_we_staking_validator">
					<div className="cd_we_staking_validator_header">
						<div className="cd_we_input_label">Validator</div>
						<div className="cd_we_input_network_fee">
							Network Fee: {getConfigKey('CSPR_AUCTION_UNDELEGATE_FEE')} CSPR
						</div>
					</div>
					<div className="cd_we_staking_validator_box">
						<SelectValidator
							publicKey={formik.values.validatorPublicKey}
							name={validatorName}
							icon={validatorIcon}
							className={'cd_we_staking_validator_box__select'}
							isShowArrow={false}
						/>
					</div>
					<div className="cd_error_text">{formik.errors.validatorPublicKey}</div>
				</div>
				<div className="cd_we_staking_redelegate">
					{getConfigKey('ENABLE_REDELEGATE') && (
						<>
							<label className={'cd_we_staking_redelegate__switch-box'}>
								<SwitchBox
									checked={formik.values.isUsingRedelegate}
									onClick={() =>
										formik.setFieldValue('isUsingRedelegate', !formik.values.isUsingRedelegate)
									}
								/>
								<span className="cd_we_staking_redelegate__switch-box-text">Using redelegate</span>
							</label>
							{formik.values.isUsingRedelegate && (
								<div className="cd_we_staking_redelegate__select-validator">
									<SelectValidator
										publicKey={formik.values.newValidatorPublicKey}
										name={_get(newValidator, 'name')}
										icon={_get(newValidator, 'icon[1]')}
										onClick={onSearchValidator}
									/>
									<div className="cd_error_text">{formik.errors.newValidatorPublicKey}</div>
								</div>
							)}
						</>
					)}
				</div>
				<div className="cd_we_staking_amount">
					<div className="cd_we_staking_amount_header">
						<div className="cd_we_input_label">Amount</div>
						<div>My staked: {toFormattedNumber(stakedAmount)}</div>
					</div>
					<div className="cd_we_staking_amount_text_box">
						<input
							name="amount"
							type="number"
							value={formik.values.amount}
							onChange={formik.handleChange}
						/>
						<div className="cd_we_amount_max_btn" onClick={() => onAmountChange(stakedAmount)}>
							Max
						</div>
					</div>
					<div className="cd_error_text">{formik.errors.amount}</div>
				</div>
				<Button type="submit" disabled={formik.errors && Object.keys(formik.errors).length !== 0}>
					Confirm
				</Button>
				<div className="cd_we_staking_note">{getConfigKey('UNDELEGATE_TIME_NOTICE')}</div>
			</form>
		</section>
	);
};
