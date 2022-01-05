import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { Button, Form, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import receiveHeadingIcon from 'assets/image/receive-heading-icon.svg';
import { getSignedStakeDeploy } from '../../../../services/stakeServices';
import { putDeploy } from '../../../../actions/deployActions';
import { pushStakeToLocalStorage } from '../../../../actions/stakeActions';
import { deploySelector } from '../../../../selectors/deploy';
import { validateStakeForm } from '../../../../helpers/validator';
import { CSPR_AUCTION_DELEGATE_FEE, MIN_CSPR_TRANSFER } from '../../../../constants/key';
import { EXPLORER_URL } from '../../../../constants/key';
import { toFormattedCurrency } from '../../../../helpers/format';
import { getLedgerOptions } from '../../../../selectors/ledgerOptions';
import ConfirmationModal from './Modal';
import SelectField from './SelectField';

const DelegateForm = ({
	fromAddress,
	defaultValidator,
	validators,
	tokenSymbol,
	balance,
	handleToggle,
	fee = CSPR_AUCTION_DELEGATE_FEE,
	csprPrice,
}) => {
	// State
	const [stakeDetails, setStakeDetails] = useState({});
	const [deployHash, setDeployHash] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [signedError, setSignerError] = useState(null);

	const dispatch = useDispatch();

	// Selector
	const { error: deployError, loading: isDeploying } = useSelector(deploySelector);
	const ledgerOptions = useSelector(getLedgerOptions);

	const options = validators
		? validators.map(({ public_key: publicKey, bidInfo }) => ({
				value: publicKey,
				label: publicKey,
				rate: bidInfo.bid.delegation_rate,
				icon: <i className="bi bi-person" />,
		  }))
		: [];

	// Function
	const onCloseModal = () => {
		setDeployHash(null);
		setStakeDetails({});
		setShowModal(false);
	};

	const handleSubmit = async (values) => {
		const { validator, amount } = values;
		if (fromAddress && validator && amount) {
			setStakeDetails({
				fromAddress,
				validator,
				amount,
				fee,
			});

			setShowModal(true);
		}
	};

	const setBalance = (percent, setFieldValue) => {
		const amount = balance / percent - fee;
		setFieldValue('amount', amount);
	};

	const onConfirm = async () => {
		try {
			if (ledgerOptions.casperApp) {
				toast('Transaction submitted. Awaiting your approval in the ledger.');
			}
			const signedDeploy = await getSignedStakeDeploy(stakeDetails, ledgerOptions);
			if (signedDeploy.error) {
				setSignerError(signedDeploy.error.message);
				return;
			}
			const deployResult = await dispatch(putDeploy(signedDeploy));
			const { data } = deployResult;
			setDeployHash(data.deployHash);
			dispatch(
				pushStakeToLocalStorage(stakeDetails.fromAddress, {
					...stakeDetails,
					deployHash: data.deployHash,
					status: 'pending',
					timestamp: signedDeploy.deploy.header.timestamp,
				}),
			);
			handleToggle();
		} catch (error) {
			setSignerError(error.message);
		}
	};

	const error = deployHash ? '' : deployError || signedError;
	return (
		<div className="cd_send_receive_content">
			<div className="cd_send_receive_content_row">
				<div className="cd_send_receive_content_full_column">
					<div className="cd_send_receive_inner_content">
						<Formik
							enableReinitialize
							initialValues={{ amount: 0, validator: defaultValidator }}
							validate={(values) =>
								validateStakeForm({
									...values,
									balance,
									tokenSymbol,
									fee,
									minAmount: MIN_CSPR_TRANSFER,
								})
							}
							onSubmit={handleSubmit}
						>
							{({ values, errors, handleChange, setFieldValue, handleSubmit }) => (
								<Form noValidate onSubmit={handleSubmit} className="cd-staking-form">
									<h3 className="cd_send_receive_heading">
										<img src={receiveHeadingIcon} alt="delegate" />
										Delegate
									</h3>
									<div className="cd_send_balance_content">
										<span className="cd_send_balance_heading">Balance</span>
										<span className="cd_send_balance_value">{balance}</span>
									</div>
									<Form.Group className="mb-3" controlId="cd-staking-validator">
										<Field name={'validator'} component={SelectField} options={options} />
										<Form.Text className="text-muted">
											<a
												className="cd-form-text-link"
												target="_blank"
												rel="noopener noreferrer"
												href={`${EXPLORER_URL}/validators`}
											>
												Help me choose
											</a>
										</Form.Text>
									</Form.Group>
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
										<Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
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
										<Button
											className="cd_send_currency_btn"
											variant="secondary"
											onClick={handleToggle}
										>
											Back
										</Button>
										<Button
											className="cd_send_currency_btn"
											variant="primary"
											type="submit"
											disabled={!values.amount || !values.validator}
											onClick={handleSubmit}
										>
											Stake
										</Button>
										<div className="cd_send_currency_text">
											<p>
												Network Fee
												<span>
													{fee} {tokenSymbol}{' '}
												</span>
											</p>
										</div>
									</div>
								</Form>
							)}
						</Formik>
						<ConfirmationModal
							title="Confirm delegation"
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
							error={error}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DelegateForm;
