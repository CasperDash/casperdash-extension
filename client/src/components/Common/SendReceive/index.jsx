import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormControl, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import QRCode from 'qrcode.react';
import { validateTransferForm } from '../../../helpers/validator';
import { getSignedTransferDeploy } from '../../../services/userServices';
import { putDeploy, pushTransferToLocalStorage } from '../.././../actions/deployActions';
import { deploySelector } from '../../../selectors/deploy';
import { CSPR_TRANSFER_FEE } from '../../../constants/key';
import { toFormattedNumber, toFormattedCurrency } from '../../../helpers/format';
import { getSignedTransferTokenDeploy } from '../../../services/tokenServices';
import { ConfirmModal } from './ConfirmModal';

export const SendReceiveSection = ({
	handleToggle,
	displayBalance = 0,
	fromAddress,
	currentPrice,
	csprPrice,
	tokenSymbol = 'CSPR',
	minAmount = 2.5,
	transferFee = CSPR_TRANSFER_FEE,
	tokenInfo,
	csprBalance,
}) => {
	const dispatch = useDispatch();

	// State
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [transactionDetails, setTransactionDetails] = useState({});
	const [signedError, setSignerError] = useState(null);
	const [deployHash, setDeployHash] = useState(null);

	//Selector
	const { error: deployError, loading: isDeploying } = useSelector(deploySelector);

	const isTokenTransfer = tokenSymbol !== 'CSPR';

	// Functions
	const setBalance = (percent, setFieldValue) => {
		const amount = displayBalance / percent - transferFee;
		setFieldValue('sendAmount', amount);
	};

	const onConfirmTransaction = async (transferId) => {
		const signedDeploy = !isTokenTransfer
			? await getSignedTransferDeploy({ ...transactionDetails, transferId })
			: await getSignedTransferTokenDeploy({ ...transactionDetails, contractInfo: tokenInfo });
		if (!signedDeploy.error) {
			const { data: hash } = await dispatch(putDeploy(signedDeploy));
			setDeployHash(hash.deployHash);
			dispatch(
				pushTransferToLocalStorage(fromAddress, {
					...transactionDetails,
					deployHash: hash.deployHash,
					status: 'pending',
					timestamp: signedDeploy.deploy.header.timestamp,
					transferId: transferId,
					...tokenInfo,
					symbol: tokenSymbol,
				}),
			);
		} else {
			setSignerError(signedDeploy.error.message);
		}
	};

	const handleSubmit = (values) => {
		setTransactionDetails({
			fromAddress: fromAddress,
			toAddress: values.toAddress,
			amount: values.sendAmount,
			fee: transferFee,
		});
		setShowConfirmModal(true);
	};

	const onCloseConfirmModal = () => {
		setSignerError(null);
		setDeployHash(null);
		setShowConfirmModal(false);
	};

	return (
		<div className="cd_send_receive_content">
			<div className="cd_send_receive_content_row">
				<div className="cd_send_receive_content_column">
					<div className="cd_send_receive_inner_content">
						<Formik
							initialValues={{ sendAmount: minAmount, toAddress: '' }}
							validate={(values) =>
								validateTransferForm({
									...values,
									minAmount,
									displayBalance,
									tokenSymbol,
									csprBalance,
									transferFee,
								})
							}
							onSubmit={handleSubmit}
						>
							{({ errors, values, handleChange, setFieldValue, handleSubmit }) => (
								<Form noValidate onSubmit={handleSubmit}>
									<h3 className="cd_send_receive_heading">
										<img src="assets/image/receive-heading-icon.svg" alt="receive-icon" />
										Send <span className="cd_send_receive_token_symbol">{tokenSymbol}</span>
									</h3>

									<div className="cd_send_balance_content">
										<span className="cd_send_balance_heading">Total Balance</span>
										<span className="cd_send_balance_value">
											{toFormattedNumber(displayBalance - values.sendAmount - transferFee)}
										</span>
									</div>
									<div className="cd_send_qr_address">
										<FormControl
											required
											placeholder="Insert address"
											name="toAddress"
											value={values.toAddress}
											onChange={handleChange}
											isInvalid={errors.toAddress}
										/>
										<Form.Control.Feedback type="invalid">{errors.toAddress}</Form.Control.Feedback>
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
													{toFormattedCurrency(values.sendAmount * currentPrice)}
												</h3>
												<h3 className="cd_send_currency_type">USD</h3>
											</>
										) : null}
									</div>
									<div className="cd_send_currency_btn_text">
										{!isTokenTransfer && (
											<Button className="cd_send_currency_btn" onClick={handleToggle}>
												Back
											</Button>
										)}
										<Button className="cd_send_currency_btn" type="submit">
											Send
										</Button>
										<div className="cd_send_currency_text">
											<p>
												Network Fee
												<span>{transferFee} CSPR </span>
											</p>
											<Form.Control.Feedback
												type="invalid"
												className="cd_send_currency_error_msg"
											>
												{errors.transferFee}
											</Form.Control.Feedback>
										</div>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</div>
				<div className="cd_send_receive_content_column">
					<div className="cd_send_receive_inner_content">
						<h3 className="cd_send_receive_heading cd_receive_heading">
							<img src="assets/image/receive-heading-icon.svg" alt="send-icon" />
							Receive
						</h3>
						<div className="cd_receive_address_content">
							<p className="cd_receive_address_heading">Address</p>
							<div className="cd_receive_copy_address_content">
								<Button onClick={() => navigator.clipboard.writeText(fromAddress)}>
									<svg
										width="20"
										height="20"
										viewBox="0 0 20 20"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M1.48116 0H12.5365C13.3244 0 13.9653 0.641 13.9653 1.42887V4.78252H12.661V1.42887C12.661 1.36022 12.6051 1.30435 12.5365 1.30435H1.48116C1.4125 1.30435 1.35663 1.36022 1.35663 1.42887V12.4842C1.35663 12.5529 1.4125 12.6087 1.48116 12.6087H4.73024V13.9131H1.48116C0.693287 13.9131 0.0522861 13.2721 0.0522861 12.4842V1.42887C0.0523291 0.641 0.693287 0 1.48116 0Z"
											fill="#CAD3F2"
										/>
										<path
											d="M7.46358 6.08691H18.5188C19.3068 6.08691 19.9478 6.72791 19.9478 7.51583V18.5711C19.9477 19.3591 19.3068 20.0001 18.5188 20.0001H7.46354C6.67562 20.0001 6.03463 19.3591 6.03463 18.5712V7.51583C6.03458 6.72791 6.67567 6.08691 7.46358 6.08691ZM7.46349 18.6957H18.5188C18.5875 18.6957 18.6434 18.6398 18.6434 18.5712V7.51583C18.6434 7.44713 18.5875 7.39126 18.5188 7.39126H7.46354C7.39484 7.39126 7.33897 7.44713 7.33897 7.51583V18.5712H7.33893C7.33893 18.6398 7.39484 18.6957 7.46349 18.6957Z"
											fill="#CAD3F2"
										/>
									</svg>
								</Button>
								<p>{fromAddress ? fromAddress : 'Please connect with Casper Sign'}</p>
							</div>
							{fromAddress && (
								<div className="cd_receive_address_qr_code">
									<QRCode
										value={fromAddress}
										bgColor={'transparent'}
										fgColor={'#CAD3F2'}
										size={166}
										className="cd_dark_theme_qrcode"
									/>
									<QRCode
										value={fromAddress}
										bgColor={'transparent'}
										fgColor={'#3D476A'}
										size={166}
										className="cd_light_theme_qrcode"
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<ConfirmModal
				show={showConfirmModal}
				onClose={onCloseConfirmModal}
				onConfirm={onConfirmTransaction}
				{...transactionDetails}
				fee={transferFee}
				csprPrice={csprPrice}
				deployHash={deployHash}
				deployError={deployHash ? '' : deployError || signedError}
				isDeploying={isDeploying}
				tokenSymbol={tokenSymbol}
				isTokenTransfer={isTokenTransfer}
				currentPrice={isTokenTransfer ? currentPrice : csprPrice}
			/>
		</div>
	);
};
