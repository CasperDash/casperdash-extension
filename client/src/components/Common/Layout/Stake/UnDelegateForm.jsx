import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';
import receiveHeading from 'assets/image/receive-heading-icon.svg';
import { getStakeDeploy } from '../../../../services/stakeServices';
import { pushStakeToLocalStorage } from '../../../../actions/stakeActions';
import { CSPR_AUCTION_UNDELEGATE_FEE, ENTRY_POINT_UNDELEGATE, MIN_CSPR_TRANSFER } from '../../../../constants/key';
import { validateUndelegateForm } from '../../../../helpers/validator';
import { toFormattedCurrency } from '../../../../helpers/format';
import { useConfirmDeploy } from '../../../hooks/useConfirmDeploy';
import ConfirmationModal from './Modal';
import ValidatorInfo from './ValidatorInfo';

const UndelegateForm = ({
	balance = 0,
	handleToggle,
	fromAddress,
	csprPrice,
	tokenSymbol,
	fee = CSPR_AUCTION_UNDELEGATE_FEE,
	stakedValidator,
}) => {
	// State
	const [stakeDetails, setStakeDetails] = useState({});
	const [deployHash, setDeployHash] = useState(null);
	const [showModal, setShowModal] = useState(false);

	// Hook
	const dispatch = useDispatch();
	const { executeDeploy, isDeploying } = useConfirmDeploy();

	// Func
	const handleSubmit = async (values) => {
		const { amount } = values;
		if (fromAddress && stakedValidator && amount) {
			setStakeDetails({
				fromAddress,
				validator: stakedValidator.validator,
				amount,
				fee,
				entryPoint: ENTRY_POINT_UNDELEGATE,
			});

			setShowModal(true);
		}
	};

	const onConfirm = async () => {
		const buildDeployFn = () => getStakeDeploy(stakeDetails);
		const { deployHash, signedDeploy } = executeDeploy(
			buildDeployFn,
			stakeDetails.fromAddress,
			stakeDetails.validator,
		);
		if (deployHash) {
			setDeployHash(deployHash);
			dispatch(
				pushStakeToLocalStorage(stakeDetails.fromAddress, {
					...stakeDetails,
					deployHash: deployHash,
					status: 'pending',
					timestamp: signedDeploy.deploy.header.timestamp,
				}),
			);
			handleToggle();
		}
	};

	// Function
	const onCloseModal = () => {
		setDeployHash(null);
		setStakeDetails({});
		setShowModal(false);
	};

	const setBalance = (percent, setFieldValue) => {
		const amount = stakedValidator.stakedAmount / percent;
		setFieldValue('amount', amount);
	};

	return (
		<>
			<ValidatorInfo
				validator={stakedValidator.validator}
				info={stakedValidator.info}
				tokenSymbol={tokenSymbol}
			/>
			<div className="cd_send_receive_content cd_undelegate_section">
				<div className="cd_send_receive_content_row">
					<div className="cd_send_receive_content_full_column">
						<div className="cd_send_receive_inner_content">
							<Formik
								validate={(values) =>
									validateUndelegateForm({
										...values,
										balance,
										tokenSymbol,
										stakedAmount: stakedValidator.stakedAmount,
										fee,
										minAmount: MIN_CSPR_TRANSFER,
									})
								}
								initialValues={{ amount: 0, toAddress: '' }}
								onSubmit={handleSubmit}
							>
								{({ errors, values, handleChange, setFieldValue, handleSubmit }) => (
									<Form noValidate onSubmit={handleSubmit} className="cd_undelegate_form">
										<h3 className="cd_send_receive_heading">
											<img src={receiveHeading} alt="undelegate" />
											Undelegate
										</h3>
										<div className="cd_send_balance_content">
											<span className="cd_send_balance_heading">Balance</span>
											<span className="cd_send_balance_value">{balance}</span>
										</div>
										<div className="cd_send_balance_content">
											<span className="cd_send_balance_heading">Staked Amount</span>
											<span className="cd_send_balance_value">
												{stakedValidator ? stakedValidator.stakedAmount : 0}
											</span>
										</div>
										<div className="cd_send_currency_input_content">
											<FormControl
												value={values.amount}
												name="amount"
												required
												type="number"
												className="cd_send_currency_input"
												onChange={handleChange}
												isInvalid={errors.amount}
											/>
											<div className="cd_send_currency_input_btns">
												<Button onClick={() => setBalance(4, setFieldValue)}>1/4</Button>
												<Button onClick={() => setBalance(2, setFieldValue)}>Half</Button>
												<Button onClick={() => setBalance(1, setFieldValue)}>All</Button>
											</div>
											<Form.Control.Feedback type="invalid">
												{errors.amount}
											</Form.Control.Feedback>
										</div>
										<div className="cd_send_currency_text_type">
											{csprPrice && !errors.amount ? (
												<>
													<h3 className="cd_send_currency_text">
														{toFormattedCurrency(values.amount * csprPrice)}
													</h3>
													<h3 className="cd_send_currency_type">USD</h3>
												</>
											) : null}
										</div>
										<div className="cd_send_currency_btn_text">
											<Button className="cd_send_currency_btn" onClick={handleToggle}>
												Back
											</Button>
											<Button
												className="cd_send_currency_btn cd_undelegate_btn"
												type="submit"
												disabled={!values.amount}
												onClick={handleSubmit}
											>
												Undelegate
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
							<ConfirmationModal
								title="Confirm undelegation"
								stakeAction="undelegate"
								show={showModal}
								validator={stakeDetails.validator}
								fromAddress={stakeDetails.fromAddress}
								amount={stakeDetails.amount}
								fee={stakeDetails.fee}
								currentPrice={csprPrice}
								onClose={onCloseModal}
								onConfirm={onConfirm}
								deployHash={deployHash}
								isDeploying={isDeploying}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default UndelegateForm;
