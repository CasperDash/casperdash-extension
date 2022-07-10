import React, { useCallback } from 'react';
import { Formik, Field } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';
import { User, StorageManager as Storage } from "casper-storage";
import { isStrongPassword } from 'web-extension/CreateWallet/utils';
// import useCreateUser from "./useCreateUser";
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
	// const { onCreateNewUser } = useCreateUser();
	const onValidate = useCallback((values) => onValidatePassword(values), []);
	const handleSubmit = useCallback(async (values) => {
		if (values.password) {
      const hashingOptions = JSON.parse(await Storage.getInstance().get("casperwallet_userhashingoptions"));
      console.log(`🚀 ~ handleSubmit ~ hashingOptions`, hashingOptions)
      const userInfo = await Storage.getInstance().get("casperwallet_userinformation");
      console.log(`🚀 ~ handleSubmit ~ userInfo`, userInfo)

      const user = new User(values.password, hashingOptions);
      console.log(`🚀 ~ handleSubmit ~ user >>`, user)

      const masterKey = user.getHDWallet();
      console.log(`🚀 ~ handleSubmit ~ masterKey`, masterKey)

      const wallet = await user.getWalletAccount(0);
      console.log(`🚀 ~ handleSubmit ~ wallet`, wallet)

      const publicKey = await wallet.getPublicKey();
      console.log(`🚀 ~ handleSubmit ~ publicKey`, publicKey)

      const res = user.deserialize(userInfo);
      console.log(`🚀 ~ handleSubmit ~ res`, res)
			// await onCreateNewUser(values.password);
		}
	}, []);

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
					{({ errors, touched, handleChange, handleBlur, handleSubmit }) => {
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
											onChange={handleChange}
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
		</section>
	);
};

export default WelcomeBackPage;
