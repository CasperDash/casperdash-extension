import React, { useCallback } from 'react';
import { Formik, Field } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';
import { isStrongPassword } from "./utils";
import useCreateUser from "./useCreateUser";
import "./CreatePasswordPage.scss";

const onValidatePassword = (values) => {
	const errors = {};

	if (!values.password) {
		errors.password = 'Password required!';
	}

  if (!values.confirmPassword) {
		errors.confirmPassword = 'Password required!';
	}

  if (!isStrongPassword(values.password)) {
    errors.password = "Password not strong enough"; 
  }

  if (!isStrongPassword(values.confirmPassword)) {
    errors.confirmPassword = "Password not strong enough"; 
  }

	if (values.password !== values.confirmPassword) {
		errors.confirmPassword = "Passwords don't match";
	}

	return errors;
};

const CreatePasswordPage = () => {
  const { onCreateNewUser } = useCreateUser();
	const onValidate = useCallback((values) => onValidatePassword(values), []);
	const handleSubmit = useCallback(async (values) => {
    if (values.password && values.confirmPassword) {
      await onCreateNewUser(values.password);
    }
	}, [onCreateNewUser]);

	return (
		<div className="cd_we_create-wallet-layout--root">
			<Formik
				initialValues={{
					password: '',
					confirmPassword: '',
				}}
				validate={onValidate}
				onSubmit={handleSubmit}
			>
				{({ errors, touched, handleChange, handleBlur, handleSubmit }) => {
					return (
						<div className="cd_we_create-wallet-layout--body">
							<Form noValidate onSubmit={handleSubmit}>
                <Form.Text>
                  Password length must be 10 or longer, and it must contain at least a lowercase, an uppercase, a numeric and a special character
                </Form.Text>
								<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
									<Form.Label>New password (8 characters min)</Form.Label>
									<FormControl
										onBlur={handleBlur}
										onChange={handleChange}
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
										onChange={handleChange}
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
