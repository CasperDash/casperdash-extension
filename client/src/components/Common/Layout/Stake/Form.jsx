import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';
import Select from 'react-select';

import ConfirmationModal from './Modal';

import { CSPR_AUCTION_FEE } from '../../../../constants/key';
import { useDispatch, useSelector } from 'react-redux';
import { getSignedStakeDeploy } from '../../../../services/stakeServices';
import { putDeploy } from '../../../../actions/deployActions';
import { pushStakeToLocalStorage } from '../../../../actions/stakeActions';

import './Form.scss';
import { deploySelector } from '../../../../selectors/deploy';
import { toFormattedNumber } from '../../../../helpers/format';
import { validateStakeForm } from '../../../../helpers/validator';
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
	/>
);

const StakingForm = ({
	fromAddress,
	validators,
	tokenSymbol,
	balance,
	handleToggle,
	fee = CSPR_AUCTION_FEE,
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

	const options = validators
		? validators.map((validator) => ({
				value: validator.public_key,
				label: validator.public_key,
		  }))
		: [];

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
				// Handle exception
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
			}
		} catch (error) {
			setSignerError(error.message);
		}
	};

	const error = deployHash ? '' : deployError || signedError;
	return (
		<div className="cd_setting_list">
			<div className="cd_setting_list_items">
				<div className="cd_setting_items_heading_peregraph cd_setting_items_form">
					<div>
						<h3 className="cd_transaction_list_main_heading">How much would you like to stake?</h3>
						<Formik
							initialValues={{ amount: 1 }}
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
											<a className="cd-form-text-link" href="https://casperstats.io/validators">
												Help me choose
											</a>
										</Form.Text>
									</Form.Group>
									<div className="cd_send_currency_btn_text">
										<Button
											className="cd_send_currency_btn"
											variant="primary"
											type="submit"
											disabled={!values.amount || !values.validator}
											onClick={handleSubmit}
										>
											Stake
										</Button>
										<Button
											className="cd_send_currency_btn"
											variant="secondary"
											onClick={handleToggle}
										>
											Back
										</Button>
									</div>
								</Form>
							)}
						</Formik>
						<ConfirmationModal
							title="Confirm delegation"
							show={showModal}
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
