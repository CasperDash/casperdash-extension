import React, { useState, useCallback } from 'react';
import { Formik } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';
import messages from "@cd/shared/formMessages";
import useCreateUser from './useCreateUser';
import './CreatePasswordPage.scss';

const onValidatePassword = (values) => {
	const errors = {};

	if (!values.password) {
		errors.password = messages.passwordRequired;
	}

	if (!values.confirmPassword) {
		errors.confirmPassword = messages.passwordRequired;
	}

	if (values.password !== values.confirmPassword) {
		errors.confirmPassword = messages.passwordNotMatching;
	}

	return errors;
};

const CreatePasswordPage = () => {
	const { onCreateNewUser } = useCreateUser();
  const [serverErrors, setServerErrors] = useState(undefined);
	const onValidate = useCallback((values) => onValidatePassword(values), []);
	const handleFormSubmit = useCallback(
		async (values) => {
			if (values.password && values.confirmPassword) {
				const result = await onCreateNewUser(values.password);

				if (!result) {
          setServerErrors({ message: messages.passwordNotStrong });
					return;
				}
			}
		},
		[onCreateNewUser],
	);

  const onChangeHandler = useCallback(
		(e, handler, fieldName) => {
			if (e?.target?.value && serverErrors) {
				setServerErrors(undefined);
			}
			handler(fieldName, e?.target?.value);
		},
		[serverErrors],
	);

	return (
		<div className="cd_we_create-wallet-layout--root">
			<Formik
				initialValues={{
					password: '',
					confirmPassword: '',
				}}
				validate={onValidate}
				onSubmit={handleFormSubmit}
			>
				{({ errors, touched, setFieldValue, handleBlur, handleSubmit }) => {
					return (
						<div className="cd_we_create-wallet-layout--body">
							<Form noValidate onSubmit={handleSubmit}>
								<Form.Text>
									Password length must be 10 or longer, and it must contain at least a lowercase, an
									uppercase, a numeric and a special character
								</Form.Text>
								<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
									<Form.Label>New password</Form.Label>
									<FormControl
										onBlur={handleBlur}
										onChange={e => onChangeHandler(e, setFieldValue, "password")}
										name="password"
										type="password"
										placeholder="New password"
									/>
									{errors.password && touched.password && (
										<Form.Text className="invalid-feedback" id="passwordHelpBlock">
											{errors.password}
										</Form.Text>
									)}
								</Form.Group>
								<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
									<Form.Label>Confirm password</Form.Label>
									<FormControl
										onBlur={handleBlur}
										onChange={e => onChangeHandler(e, setFieldValue, "confirmPassword")}
										name="confirmPassword"
										type="password"
										placeholder="Confirm Password"
									/>
									{errors.confirmPassword && touched.confirmPassword && (
										<Form.Text className="invalid-feedback" id="confirmPasswordHelpBlock">
											{errors.confirmPassword}
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
										Register
									</Button>
								</div>
							</Form>
						</div>
					);
				}}
			</Formik>
		</div>
	);
};

export default CreatePasswordPage;
