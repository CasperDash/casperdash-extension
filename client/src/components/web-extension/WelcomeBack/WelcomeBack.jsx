import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';
import { isStrongPassword } from '@cd/web-extension/CreateWallet/utils';
import { onResetUserCache } from '@cd/web-extension/CreateWallet/wallet/storage';
import useWelcomeBack from './useWelcomeBack';
import './WelcomeBack.scss';

const onValidatePassword = (values) => {
	const errors = {};

	if (!values.password) {
		errors.password = 'Password required!';
	}

	if (!isStrongPassword(values.password)) {
		errors.password = 'Password not strong enough';
	}

	return errors;
};

const WelcomeBackPage = () => {
	const { onAuthCredentialSuccess, validateUserCredential } = useWelcomeBack();
	const navigate = useNavigate();
	const [serverErrors, setServerErrors] = useState(undefined);
	const onValidate = useCallback((values) => onValidatePassword(values), []);
	const handleSubmit = useCallback(
		async (values) => {
			if (values.password) {
				const result = await validateUserCredential(values.password);

				if (!result) {
					setServerErrors({ message: 'Wrong password provided. Please try again' });
					return;
				} else {
					setServerErrors(undefined);
				}

				result.publicKey && onAuthCredentialSuccess(result.publicKey);
			}
		},
		[onAuthCredentialSuccess, validateUserCredential],
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

	const onReset = useCallback(async () => {
		await onResetUserCache();
		navigate('/');
	}, [navigate]);

	return (
		<section className="cd_we_page--root">
			<div className="cd_we_create-wallet-layout--root">
				<Formik
					initialValues={{
						password: '',
					}}
					validate={onValidate}
					onSubmit={handleSubmit}
				>
					{({ errors, touched, setFieldValue, handleBlur, handleSubmit }) => {
						return (
							<div className="cd_we_create-wallet-layout--body">
								<Form noValidate onSubmit={handleSubmit}>
									<Form.Text>
										<h2>Welcome Back!</h2>
									</Form.Text>
									<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
										<Form.Label>Enter password</Form.Label>
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
										<div className="cd_we_welcomeBack--bottom">
											<Button onClick={onReset} variant="link">
												Log in as another user?
											</Button>
										</div>
									</div>
								</Form>
							</div>
						);
					}}
				</Formik>
			</div>
		</section>
	);
};

export default WelcomeBackPage;
