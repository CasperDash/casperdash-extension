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
		value={options ? options.find((option) => option.value === field.value) : ''}
		onChange={(option) => form.setFieldValue(field.name, option.value)}
		onBlur={field.onBlur}
		placeholder="Validator"
	/>
);

const StakingForm = ({ fromAddress, handleToggle, fee = CSPR_AUCTION_FEE, csprPrice }) => {
	// State
	const [stakeDetails, setStakeDetails] = useState({});
	const [deployHash, setDeployHash] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [signedError, setSignerError] = useState(null);

	const dispatch = useDispatch();

	// Selector
	const { error: deployError, loading: isDeploying } = useSelector(deploySelector);

	const options = [
		{
			value: '0196948158bf5b35c0c84f680f110b8debaa4e7628e13ba336a95651a214d3b9bd',
			label: '0196948158bf5b35c0c84f680f110b8debaa4e7628e13ba336a95651a214d3b9bd',
		},
		{
			value: '0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca',
			label: '0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca',
		},
		{ value: 'vanilla', label: 'Vanilla' },
	];

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
						<Formik initialValues={{ amount: 1 }} onSubmit={handleSubmit}>
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
										/>
									</Form.Group>
									<Form.Group className="mb-3" controlId="cd-staking-validator">
										<Field
											name={'validator'}
											onChange={handleChange}
											component={SelectField}
											options={options}
										/>
									</Form.Group>
									<div className="cd_send_currency_btn_text">
										<Button
											className="cd_send_currency_btn"
											variant="primary"
											type="submit"
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
							error={error}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StakingForm;
