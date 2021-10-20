import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
const validate = (password, repeatPassword) => {
	if (!password) {
		return { password: 'Required' };
	}
	if (!repeatPassword) {
		return { repeatPassword: 'Required' };
	}
	if (password !== repeatPassword) {
		return { repeatPassword: 'Password does not math' };
	}
	return {};
};

export const CreatePassword = ({ setHasError, finalPassword, setFinalPassword }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [password, setPassword] = useState(finalPassword);
	const [repeatPassword, setRepeatPassword] = useState(finalPassword);
	const [errors, setErrors] = useState({});

	const passwordFieldType = showPassword ? 'text' : 'password';
	const updateFinalPassword = (errs, value) => {
		if (Object.keys(errs).length) {
			setHasError(true);
		} else {
			setHasError(false);
			setFinalPassword(value);
		}
	};

	const onChangePassword = (value) => {
		setPassword(value);
		const errs = validate(value, repeatPassword);
		setErrors(errs);
		updateFinalPassword(errs, value);
	};

	const onChangeRepeatPassword = (value) => {
		setRepeatPassword(value);
		const errs = validate(password, value);
		setErrors(errs);
		updateFinalPassword(errs, value);
	};
	return (
		<>
			<p className="cd_create_wallet_paragraph">
				To create a wallet, please pick a password first. This password will be used to guard access to
				CasperDash wallet.
			</p>

			<div className="cd_create_wallet_input_list">
				<Form.Group className="cd_create_wallet_input_items">
					<Form.Label>New Password</Form.Label>
					<Form.Control
						type={passwordFieldType}
						placeholder="New Password"
						value={password}
						onChange={(e) => onChangePassword(e.target.value)}
					/>
					<Form.Control.Feedback type="invalid" className="cd_create_wallet_error_msg">
						{errors.password}
					</Form.Control.Feedback>
				</Form.Group>
				<Form.Group className="cd_create_wallet_input_items">
					<Form.Label>Repeat Password</Form.Label>
					<Form.Control
						type={passwordFieldType}
						placeholder="Repeat Password"
						value={repeatPassword}
						onChange={(e) => onChangeRepeatPassword(e.target.value)}
					/>
					<Form.Control.Feedback type="invalid" className="cd_create_wallet_error_msg">
						{errors.repeatPassword}
					</Form.Control.Feedback>
				</Form.Group>
				<Form.Group className="cd_create_wallet_input_items no-border">
					<Form.Check
						type="checkbox"
						label="Show password"
						onClick={(e) => setShowPassword(e.target.checked)}
						checked={showPassword}
					/>
				</Form.Group>
			</div>
		</>
	);
};
