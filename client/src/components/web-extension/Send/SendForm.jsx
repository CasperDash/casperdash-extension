import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, FormControl } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import { toast } from 'react-toastify';
import { validateTransferForm } from '@cd/helpers/validator';
import { getAllTokenInfo, getTokenInfoByAddress } from '@cd/selectors/user';
import { getCurrentUserSW } from "@cd/hooks/useServiceWorker";
import TokenSelectField from './TokenSelectField';

const SendForm = ({ token }) => {
	const [user, setUser] = useState(undefined);

	//Hook
	const navigate = useNavigate();
	const { pathname } = useLocation();

	//State
	const [selectedTokenAddress, setSelectedTokenAddress] = useState(token ? token.address : 'CSPR');

	//Selector
	const allTokenInfo = useSelector(getAllTokenInfo);
	const selectedToken = useSelector(getTokenInfoByAddress({ address: selectedTokenAddress }));

	//Function
	const handleTokenChange = (address) => {
		setSelectedTokenAddress(address);
	};

	const handleSubmit = (values) => {
		navigate(`${pathname}#confirm`, { state: { token: { ...selectedToken, ...values }, name: 'Review' } });
	};

	const onValidate = (values) => {
		return validateTransferForm({
			...values,
			...selectedToken,
			displayBalance: selectedToken && selectedToken.balance && selectedToken.balance.displayValue,
			tokenSymbol: selectedToken.symbol,
		});
	};

	// Functions
	const setBalance = (percent, setFieldValue) => {
		const balance = (selectedToken && selectedToken.balance && selectedToken.balance.displayValue) || 0;
		const amount = balance / percent - (selectedToken.address === 'CSPR' ? selectedToken.transferFee : 0);
		setFieldValue('sendAmount', amount);
	};

	React.useEffect(() => {
		const loadUser = async () => await getCurrentUserSW();
		loadUser().then(result => {
			if (!result) {
				toast.warning('Please re-login to continue sending token');
			}
			result && setUser(result);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Formik
			initialValues={{
				sendAmount: 0,
				toAddress: '',
				address: token ? token.address : 'CSPR',
			}}
			validate={(values) =>
				onValidate({
					...values,
				})
			}
			onSubmit={handleSubmit}
		>
			{({ errors, values, handleChange, handleSubmit, setFieldValue }) => (
				<Form noValidate onSubmit={handleSubmit}>
					<div className="cd_we_send_token">
						<div className="cd_we_input_label">Assets</div>
						<Form.Group controlId="cd_token_dropdown">
							<Field
								name="address"
								component={TokenSelectField}
								options={allTokenInfo}
								handleTokenChange={handleTokenChange}
							/>
						</Form.Group>
						<Form.Control.Feedback type="invalid">{errors.nftContract}</Form.Control.Feedback>
					</div>
					<div className="cd_we_send_amount">
						<div className="cd_we_input_label">Transfer Amount</div>
						<div className="cd_we_amount_input">
							<FormControl
								value={values.sendAmount}
								name="sendAmount"
								required
								type="number"
								className="cd_we_send_input"
								onChange={handleChange}
								isInvalid={errors.sendAmount}
							/>
							<div className="cd_we_amount_max_btn" onClick={() => setBalance(1, setFieldValue)}>
								Max
							</div>
						</div>
						<Form.Control.Feedback type="invalid">{errors.sendAmount}</Form.Control.Feedback>
					</div>
					<div className="cd_we_send_address">
						<div className="cd_we_input_label">Receiving Address</div>
						<FormControl
							value={values.toAddress}
							name="toAddress"
							required
							className="cd_we_send_input"
							onChange={handleChange}
							isInvalid={errors.toAddress}
							placeholder="Enter receiving address"
						/>

						<Form.Control.Feedback type="invalid">{errors.toAddress}</Form.Control.Feedback>
					</div>
					<div className="cd_we_send_transfer_id">
						<div className="cd_we_input_label">Transfer ID (optional)</div>
						<FormControl
							value={values.transferId}
							name="transferId"
							required
							className="cd_we_send_input"
							onChange={handleChange}
							isInvalid={errors.transferId}
							placeholder="Enter note"
							type="number"
						/>

						<Form.Control.Feedback type="invalid">{errors.toAddress}</Form.Control.Feedback>
					</div>
					<div className="cd_we_send_fee">
						<div className="cd_we_input_label">Network Fee</div>
						<div>{token ? token.transferFee : 1} CSPR</div>
					</div>

					<div className="cd_we_send_actions">
						<Button
							className="cd_we_send_confirm_btn"
							type="submit"
							disabled={(errors && Object.keys(errors).length) || !user}
						>
							Confirm
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default SendForm;
