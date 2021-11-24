import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';
import { CSPR_AUCTION_UNDELEGATE_FEE } from '../../../../constants/key';

const UndelegateForm = ({
	balance = 0,
	handleToggle,
	currentPrice,
	fee = CSPR_AUCTION_UNDELEGATE_FEE,
	stakedValidator,
}) => {
	console.log('Validator', stakedValidator);
	const setBalance = (percent, setFieldValue) => {
		const amount = balance / percent;
		setFieldValue('sendAmount', amount);
	};

	return (
		<div className="cd_send_receive_content">
			<div className="cd_send_receive_content_row">
				<div className="cd_send_receive_content_full_column">
					<div className="cd_send_receive_inner_content">
						<Formik initialValues={{ sendAmount: 0, toAddress: '' }}>
							{({ errors, values, handleChange, setFieldValue, handleSubmit }) => (
								<Form noValidate onSubmit={handleSubmit}>
									<h3 className="cd_send_receive_heading">
										<img src="assets/image/receive-heading-icon.svg" />
										Undelegate
									</h3>
									<div className="cd_send_balance_content">
										<span className="cd_send_balance_heading">Validator</span>
										<span className="cd_send_balance_label">
											{stakedValidator ? stakedValidator.validator : 'N/A'}
										</span>
									</div>
									<div className="cd_send_balance_content">
										<span className="cd_send_balance_heading">Staked Amount</span>
										<span className="cd_send_balance_value">
											{stakedValidator ? stakedValidator.stakedAmount : 0}
										</span>
									</div>
									<div className="cd_send_balance_content">
										<span className="cd_send_balance_heading">Balance</span>
										<span className="cd_send_balance_value">{balance}</span>
									</div>
									<div className="cd_send_currency_input_content">
										<FormControl
											value={values.sendAmount}
											name="sendAmount"
											required
											type="number"
											className="cd_send_currency_input"
											onChange={handleChange}
											isInvalid={errors.sendAmount}
										/>

										<div className="cd_send_currency_input_btns">
											<Button onClick={() => setBalance(4, setFieldValue)}>1/4</Button>
											<Button onClick={() => setBalance(2, setFieldValue)}>Half</Button>
											<Button onClick={() => setBalance(1, setFieldValue)}>All</Button>
										</div>
										<Form.Control.Feedback type="invalid">
											{errors.sendAmount}
										</Form.Control.Feedback>
									</div>
									<div className="cd_send_currency_text_type">
										{currentPrice ? (
											<>
												<h3 className="cd_send_currency_text">
													${parseFloat(values.sendAmount * currentPrice).toFixed(2)}
												</h3>
												<h3 className="cd_send_currency_type">USD</h3>
											</>
										) : null}
									</div>
									<div className="cd_send_currency_btn_text">
										<Button className="cd_send_currency_btn" onClick={handleToggle}>
											Back
										</Button>
										<Button className="cd_send_currency_btn" type="submit">
											Send
										</Button>
										<div className="cd_send_currency_text">
											<p>
												Network Fee
												<span>{fee} CSPR </span>
											</p>
											<Form.Control.Feedback
												type="invalid"
												className="cd_send_currency_error_msg"
											>
												{errors.fee}
											</Form.Control.Feedback>
										</div>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UndelegateForm;
