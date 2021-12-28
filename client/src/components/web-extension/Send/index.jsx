import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button, Form, FormControl } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import { getAllTokenInfo } from '../../../selectors/user';
import { validateTransferForm } from '../../../helpers/validator';
import TokenSelectField from './TokenSelectField';
import './Send.scss';

const Send = () => {
	//Hook
	const {
		state: { token },
	} = useLocation();

	//Selector
	const allTokenInfo = useSelector(getAllTokenInfo);

	//Function
	const getTokenInfo = (address) => {
		return allTokenInfo ? allTokenInfo.find((token) => token.address === address) : {};
	};

	const handleSubmit = (values) => {
		console.info(values);
	};

	const onValidate = (values) => {
		const tokenInfo = getTokenInfo(values.address);
		return validateTransferForm({
			...values,
			...tokenInfo,
			displayBalance: tokenInfo && tokenInfo.balance && tokenInfo.balance.displayValue,
			tokenSymbol: tokenInfo.symbol,
		});
	};

	return (
		<section className="cd_we_send_page">
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
								<Field name="address" component={TokenSelectField} options={allTokenInfo} />
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
		</section>
	);
};

export default Send;
