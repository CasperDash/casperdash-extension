import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';
import { User } from "casper-storage";
import { isStrongPassword } from 'web-extension/CreateWallet/utils';
import { onGetUserHashingOptions, onGetUserInfo, onResetUserCache } from "web-extension/CreateWallet/wallet/storage";
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
  const navigate = useNavigate();
	const onValidate = useCallback((values) => onValidatePassword(values), []);
	const handleSubmit = useCallback(async (values) => {
		if (values.password) {
      try {  
        const encryptedHashingOptions = JSON.parse(await onGetUserHashingOptions());
        const encryptedUserInfo = await onGetUserInfo();
        
        console.log(`🚀 ~ >> ~ encryptedHashingOptions`, encryptedHashingOptions)
        console.log(`🚀 ~ >> ~ encryptedUserInfo`, encryptedUserInfo)

        const user = new User(values.password, encryptedUserInfo, {
          passwordOptions: encryptedHashingOptions
        });
        console.log(`🚀 ~ >> ~ user: `, user)

        const testHashingOptions = user.getPasswordHashingOptions();
        console.log(`🚀 ~ >> ~ testHashingOptions`, testHashingOptions)

        const masterKey = user.getHDWallet();
        console.log(`🚀 ~ >> ~ masterKey`, masterKey)

        const wallet = await user.getWalletAccount(1);
        console.log(`🚀 ~ >> ~ wallet`, wallet)

        const publicKey = await wallet.getPublicKey();
        console.log(`🚀 ~ >> ~ publicKey`, publicKey)

        const res = user.deserialize(encryptedUserInfo);
        console.log(`🚀 ~ >> ~ res`, res)
        // await onCreateNewUser(values.password);
      } catch (err) {
        console.log(`🚀 ~ >> ~ err`, err)
      }
		}
	}, []);

  const onReset = useCallback(async () => {
    await onResetUserCache();
    navigate("/");
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
                    <button onClick={onReset}>Reset</button>
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
