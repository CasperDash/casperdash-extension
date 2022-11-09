import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';
import messages from '@cd/shared/formMessages';

const onValidatePassword = (values) => {
	const errors = {};

	if (!values.password) {
		errors.password = messages.passwordRequired;
	}

	return errors;
};

const PasswordForm = ({ header = null, passwordLabel = 'Enter password', onSubmitPassword }) => {
	const [serverErrors, setServerErrors] = useState(undefined);
	const onValidate = useCallback((values) => onValidatePassword(values), []);

	const handleFormSubmit = useCallback(
		async (values) => {
			if (values.password && onSubmitPassword) {
				onSubmitPassword(values.password);
			}
		},
		[onSubmitPassword],
	);

	const onChangeHandler = useCallback(
		(e, handler) => {
			if (e?.target?.value && serverErrors) {
				setServerErrors(undefined);
			}
			handler('password', e?.target?.value);
		},
		[serverErrors],
	);

	return (
		<Formik
			initialValues={{
				password: '',
			}}
			validate={onValidate}
			onSubmit={handleFormSubmit}
		>
			{({ errors, touched, setFieldValue, handleBlur, handleSubmit }) => {
				return (
					<Form noValidate onSubmit={handleSubmit}>
						{header}
						<Form.Group className="mb-3">
							<Form.Label>{passwordLabel}</Form.Label>
							<FormControl
								onBlur={handleBlur}
								onChange={(e) => onChangeHandler(e, setFieldValue)}
								name="password"
								type="password"
								placeholder="Enter password"
							/>
							{errors.password && touched.password && (
								<Form.Text className="invalid-feedback" id="passwordHelpBlock">
									{errors.password}
								</Form.Text>
							)}
						</Form.Group>
						{serverErrors && (
							<Form.Text className="invalid-feedback" id="passwordHelpBlock">
								{serverErrors.message}
							</Form.Text>
						)}
						<div className="cd_we_page--bottom">
							<Button type="submit" className="cd_we_btn-next" disabled={false}>
								Unlock
							</Button>
						</div>
					</Form>
				);
			}}
		</Formik>
	);
};

PasswordForm.propTypes = {
	header: PropTypes.node,
	isShowReset: PropTypes.bool,
	onSubmitPassword: PropTypes.func,
	passwordLabel: PropTypes.string,
};

export default PasswordForm;
