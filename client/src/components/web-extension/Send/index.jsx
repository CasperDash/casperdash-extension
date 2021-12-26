import React from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { Formik } from 'formik';
import './Send.scss';

const Send = () => {
	//Selector

	//Function
	const handleSubmit = (values) => {
		console.info(values);
	};

	const validateTransferForm = (values) => {
		console.info(values);
	};

	return (
		<section className="cd_we_send_page">
			<Formik
				initialValues={{ sendAmount: 0, toAddress: '' }}
				validate={(values) =>
					validateTransferForm({
						...values,
					})
				}
				onSubmit={handleSubmit}
			>
				{({ errors, values, handleChange, handleSubmit }) => (
					<Form noValidate onSubmit={handleSubmit}>
						<div className="cd_we_send_token">
							<div>Assets</div>
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
								placeholder="Please enter receiving address or QR code"
							/>

							<Form.Control.Feedback type="invalid">{errors.toAddress}</Form.Control.Feedback>
						</div>
						<div className="cd_we_send_transfer_id">
							<div>Transfer ID</div>
							<FormControl
								value={values.transferId}
								name="transferId"
								required
								className="cd_we_send_input"
								onChange={handleChange}
								isInvalid={errors.transferId}
								placeholder="Enter note here"
							/>

							<Form.Control.Feedback type="invalid">{errors.toAddress}</Form.Control.Feedback>
						</div>

						<div className="cd_we_send_actions">
							<Button className="cd_send_currency_btn" type="submit">
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
