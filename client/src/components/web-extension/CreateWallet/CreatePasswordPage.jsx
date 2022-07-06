import React, { useCallback } from 'react';
import { Formik, Field } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';


const onValidatePassword = values => {
  const errors = {};

  if (!values.password || !values.confirmPassword) {
    errors.password = 'Password required!';
    errors.confirmPassword = 'Password required!';
  }

  if (values.password?.length < 8) {
    errors.password = 'Password not long enough';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords don't match";
  }

  return errors;
}

const CreatePasswordPage = () => {
	const onValidate = useCallback(values => onValidatePassword(values), []);
	const handleSubmit = useCallback((values) => {
		console.log(`🚀 ~ >>>V: `, values);
	}, []);
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
        {({ errors, touched, values, handleChange, handleBlur, handleSubmit }) => {
          return (
          <div className="cd_we_create-wallet-layout--body">
            <Form noValidate onSubmit={handleSubmit}>
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
                  <Form.Text id="passwordHelpBlock" muted>
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
                  <Form.Text id="confirmPasswordHelpBlock" muted>
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
