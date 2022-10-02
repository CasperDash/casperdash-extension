import React, { useState, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormControl } from 'react-bootstrap';
import messages from '@cd/shared/formMessages';
import useLoginPassword from '@cd/components/hooks/useLoginPassword';
import { getIsOpen } from '@cd/selectors/loginModal';
import { setIsOpen } from '@cd/actions/loginModalAction';
import './LoginModal.scss';

const onValidatePassword = (values) => {
	const errors = {};

	if (!values.password) {
		errors.password = messages.passwordRequired;
	}

	return errors;
};

export const LoginModal = () => {
	const isOpen = useSelector(getIsOpen);
	const dispatch = useDispatch();

	const { onAuthCredentialSuccess, validateUserCredential } = useLoginPassword();
	const [serverErrors, setServerErrors] = useState(undefined);
	const onValidate = useCallback((values) => onValidatePassword(values), []);
	const handleFormSubmit = useCallback(
		async (values) => {
			if (values.password) {
				const result = await validateUserCredential(values.password);

				if (!result) {
					setServerErrors({ message: messages.passwordWrong });
					return;
				}

				result.publicKey && onAuthCredentialSuccess(result);
				dispatch(setIsOpen(false));
			}
		},
		[dispatch, onAuthCredentialSuccess, validateUserCredential],
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
		<Modal backdropClassName="cd_we_login-modal--backdrop" show={isOpen} className="cd_we_login-modal" centered>
			<Modal.Header closeButton={false}>
				<Modal.Title>Your session has expired</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="cd_we_create-wallet-layout--root">
					<Formik
						initialValues={{
							password: '',
						}}
						validate={onValidate}
						onSubmit={handleFormSubmit}
					>
						{({ errors, touched, setFieldValue, handleBlur, handleSubmit }) => {
							return (
								<div className="cd_we_create-wallet-layout--body">
									<Form noValidate onSubmit={handleSubmit}>
										<Form.Group className="mb-3">
											<Form.Label>Please login again to continue using Casper Wallet.</Form.Label>
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
								</div>
							);
						}}
					</Formik>
				</div>
			</Modal.Body>
		</Modal>
	);
};
