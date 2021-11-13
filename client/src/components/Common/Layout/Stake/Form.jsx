import React from 'react';
import { Formik, Field } from 'formik';
import { Container, Row, Button, Form, FormControl } from 'react-bootstrap';
import Select from 'react-select';

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

const StakingForm = ({ handleToggle }) => {
	const options = [
		{ value: 'chocolate', label: 'Chocolate' },
		{ value: 'strawberry', label: 'Strawberry' },
		{ value: 'vanilla', label: 'Vanilla' },
	];

	const handleSubmit = (values) => {
		console.log('Submit', values);
	};

	return (
		<div>
			<Formik initialValues={{ amount: 1 }} onSubmit={handleSubmit}>
				{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
					<Form noValidate onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="cd-staking-amount">
							<FormControl name="amount" type="number" placeholder="Amount" required />
						</Form.Group>
						<Form.Group className="mb-3" controlId="cd-staking-validator">
							<Field name={'example'} component={SelectField} options={options} />
						</Form.Group>
						<div className="cd_send_currency_btn_text">
							<Button className="cd_send_currency_btn" variant="primary" type="submit">
								Stake
							</Button>
							<Button className="cd_send_currency_btn" variant="secondary" onClick={handleToggle}>
								Back
							</Button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default StakingForm;
