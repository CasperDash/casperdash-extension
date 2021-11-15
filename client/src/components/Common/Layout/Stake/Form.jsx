import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';
import Select from 'react-select';

import ConfirmationModal from './Modal';

import { CSPR_TRANSFER_FEE } from '../../../../constants/key';
import { useDispatch } from 'react-redux';
import { getSignedStakeDeploy } from '../../../../services/stakeServices';

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
	/>
);

const StakingForm = ({ fromAddress, handleToggle, fee = CSPR_TRANSFER_FEE, csprPrice }) => {
	// State
	const [stakeDetails, setStakeDetails] = useState({});
	const [deployHash, setDeployHash] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const dispatch = useDispatch();

	const options = [
		{
			value: '0196948158bf5b35c0c84f680f110b8debaa4e7628e13ba336a95651a214d3b9bd',
			label: '0196948158bf5b35c0c84f680f110b8debaa4e7628e13ba336a95651a214d3b9bd',
		},
		{ value: 'strawberry', label: 'Strawberry' },
		{ value: 'vanilla', label: 'Vanilla' },
	];

	// Function
	const onCloseModal = () => {
		setShowModal(false);
	};

	const handleSubmit = async (values) => {
		const { validator, amount } = values;
		console.log('Input', validator, amount, fromAddress);
		if (fromAddress && validator && amount) {
			setStakeDetails({
				fromAddress,
				validator,
				amount,
				fee,
			});

			setShowModal(true);
			// const signedDeploy = await dispatch(
			// 	getSignedStakeDeploy({
			// 		fromAddress,
			// 		validator,
			// 		amount,
			// 		fee,
			// 	}),
			// );
			// console.log('Signed Deploy', signedDeploy);
		}
	};

	const onComfirm = async () => {};

	return (
		<div>
			<Formik initialValues={{ amount: 1 }} onSubmit={handleSubmit}>
				{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
					<Form noValidate onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="cd-staking-amount">
							<FormControl name="amount" type="number" placeholder="Amount" required />
						</Form.Group>
						<Form.Group className="mb-3" controlId="cd-staking-validator">
							<Field name={'validator'} component={SelectField} options={options} />
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
							<Button className="cd_send_currency_btn" variant="secondary" onClick={handleToggle}>
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
			/>
		</div>
	);
};

export default StakingForm;
