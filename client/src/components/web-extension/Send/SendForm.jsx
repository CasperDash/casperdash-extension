import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, FormControl } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import { getAllTokenInfo, getTokenInfoByAddress } from '../../../selectors/user';
import { validateTransferForm } from '../../../helpers/validator';
import TokenSelectField from './TokenSelectField';

const SendForm = ({ token }) => {
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
		navigate(`${pathname}#confirm`, { state: { token: { ...selectedToken, ...values }, name: 'Confirm' } });
	};

	const onValidate = (values) => {
		return validateTransferForm({
			...values,
			...selectedToken,
			displayBalance: selectedToken && selectedToken.balance && selectedToken.balance.displayValue,
			tokenSymbol: selectedToken.symbol,
		});
	};

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
			{({ errors, values, handleChange, handleSubmit }) => (
				<Form noValidate onSubmit={handleSubmit}>
					<div className="cd_we_send_token">
						<div>Assets</div>
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
						<div>Transfer Amount</div>
						<FormControl
							value={values.sendAmount}
							name="sendAmount"
							required
							type="number"
							className="cd_we_send_input"
							onChange={handleChange}
							isInvalid={errors.sendAmount}
						/>

						<Form.Control.Feedback type="invalid">{errors.sendAmount}</Form.Control.Feedback>
					</div>
					<div className="cd_we_send_address">
						<div>Receiving Address</div>
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
						<div>Transfer ID (optional)</div>
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
						<div>Network Fee</div>
						<div>{token ? token.transferFee : 1} CSPR</div>
					</div>

					<div className="cd_we_send_actions">
						<Button className="cd_we_send_confirm_btn" type="submit">
							Confirm
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default SendForm;
