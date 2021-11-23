import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';
import Select from 'react-select';

import { useDispatch, useSelector } from 'react-redux';

import ConfirmationModal from './Modal';

import { getSignedStakeDeploy } from '../../../../services/stakeServices';
import { putDeploy } from '../../../../actions/deployActions';
import { pushStakeToLocalStorage } from '../../../../actions/stakeActions';

import { deploySelector } from '../../../../selectors/deploy';
import { toFormattedNumber } from '../../../../helpers/format';
import { validateStakeForm } from '../../../../helpers/validator';

import { CSPR_AUCTION_DELEGATE_FEE, ENTRY_POINT_DELEGATE, ENTRY_POINT_UNDELEGATE } from '../../../../constants/key';
import { EXPLORER_URL } from '../../../../constants/key';

/**
 * Wrap releact-select to work with Formik.
 *
 * @param {Object}
 * @returns
 */
const SelectField = ({ options, field, form }) => (
	<Select
		options={options}
		name={field.name}
		value={options ? options.find((option) => option.value === field.value) : null}
		onChange={(option) => form.setFieldValue(field.name, option.value)}
		onBlur={field.onBlur}
		placeholder="Validator"
		getOptionLabel={(e) => (
			<div>
				<div>
					{e.icon} {e.label}
				</div>
				<div>
					<small>Rate: {e.rate}%</small>
				</div>
			</div>
		)}
	/>
);

/**
 * Map the select options from the validators.
 *
 * @param {Array} validators
 * @param {String} action
 * @param {String} defaultValidator
 * @returns
 */
const getValidatorSelectOpts = (validators, action, defaultValidator) => {
	if (!validators) {
		return [];
	}

	let massagedValidators = validators;
	if (ENTRY_POINT_UNDELEGATE === action) {
		massagedValidators = validators.filter(({ public_key: publicKey }) => defaultValidator === publicKey);
	}

	return massagedValidators.map(({ public_key: publicKey, bid }) => ({
		value: publicKey,
		label: publicKey,
		rate: bid.bid.delegation_rate,
		icon: <i className="bi bi-person"></i>,
	}));
};

const StakingForm = ({
	action = ENTRY_POINT_DELEGATE,
	fromAddress,
	defaultValidator,
	validators,
	tokenSymbol,
	balance,
	handleToggle,
	fee = CSPR_AUCTION_DELEGATE_FEE,
	csprPrice,
}) => {
	// State
	const [stakeDetails, setStakeDetails] = useState({});
	const [deployHash, setDeployHash] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [signedError, setSignerError] = useState(null);

	const dispatch = useDispatch();

	// Selector
	const { error: deployError, loading: isDeploying } = useSelector(deploySelector);

	// Function
	const onCloseModal = () => {
		setDeployHash(null);
		setStakeDetails({});
		setShowModal(false);
	};

	const handleSubmit = async (values) => {
		const { validator, amount } = values;
		if (fromAddress && validator && amount) {
			setStakeDetails({
				fromAddress,
				validator,
				amount,
				fee,
				entryPoint: action,
			});

			setShowModal(true);
		}
	};

	const onComfirm = async () => {
		try {
			const signedDeploy = await getSignedStakeDeploy(stakeDetails);
			if (signedDeploy.error) {
				setSignerError(signedDeploy.error.message);
			} else {
				const deployResult = await dispatch(putDeploy(signedDeploy));
				const { data } = deployResult;
				setDeployHash(data.deployHash);
				dispatch(
					pushStakeToLocalStorage(stakeDetails.fromAddress, {
						...stakeDetails,
						deployHash: data.deployHash,
						status: 'pending',
						timestamp: signedDeploy.deploy.header.timestamp,
					}),
				);
				handleToggle();
			}
		} catch (error) {
			setSignerError(error.message);
		}
	};

	const error = deployHash ? '' : deployError || signedError;
	const modalTitle = ENTRY_POINT_DELEGATE === action ? 'Confirm delegation' : 'Confirm undelegation';
	const options = getValidatorSelectOpts(validators, action, defaultValidator);

	return (
		<div className="cd_setting_list">
			<div className="cd_setting_list_items">
				<div className="cd_setting_items_heading_peregraph cd_setting_items_form">
					<div>
						<h3 className="cd_transaction_list_main_heading">How much would you like to {action} stake?</h3>
						<Formik
							enableReinitialize
							initialValues={{ amount: 1, validator: defaultValidator }}
							validate={(values) =>
								validateStakeForm({
									...values,
									balance,
									tokenSymbol,
									fee,
								})
							}
							onSubmit={handleSubmit}
						>
							{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
								<Form noValidate onSubmit={handleSubmit} className="cd-staking-form">
									<Form.Group className="mb-3" controlId="cd-staking-amount">
										<FormControl
											name="amount"
											value={values.amount}
											onChange={handleChange}
											type="number"
											placeholder="Amount"
											required
											isInvalid={errors.amount}
										/>
										<Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
										<Form.Text className="text-muted">
											{toFormattedNumber(balance)} {tokenSymbol}{' '}
										</Form.Text>
									</Form.Group>
									<Form.Group className="mb-3" controlId="cd-staking-validator">
										<Field name={'validator'} component={SelectField} options={options} />
										<Form.Text className="text-muted">
											<a
												className="cd-form-text-link"
												target="_blank"
												rel="noopener noreferrer"
												href={`${EXPLORER_URL}/validators`}
											>
												Help me choose
											</a>
										</Form.Text>
									</Form.Group>
									<div className="cd_send_currency_btn_text">
										<Button
											className="cd_send_currency_btn cd_stake_btn"
											variant="primary"
											type="submit"
											disabled={!values.amount || !values.validator}
											onClick={handleSubmit}
										>
											{action}
										</Button>
										<Button
											className="cd_send_currency_btn"
											variant="secondary"
											onClick={handleToggle}
										>
											Back
										</Button>
										<div className="cd_send_currency_text">
											<p>
												Network Fee
												<span>
													{fee} {tokenSymbol}{' '}
												</span>
											</p>
										</div>
									</div>
								</Form>
							)}
						</Formik>
						<ConfirmationModal
							title={modalTitle}
							show={showModal}
							action={action}
							validator={stakeDetails.validator}
							fromAddress={stakeDetails.fromAddress}
							amount={stakeDetails.amount}
							fee={stakeDetails.fee}
							currentPrice={csprPrice}
							onClose={onCloseModal}
							onConfirm={onComfirm}
							deployHash={deployHash}
							isDeploying={isDeploying}
							error={error}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StakingForm;
