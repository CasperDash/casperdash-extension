/* eslint-disable complexity */
import React, { useEffect, useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMassagedUserDetails, getPublicKey } from '../../../selectors/user';
import { MiddleTruncatedText } from '../../Common/MiddleTruncatedText';
import { fetchValidators } from '../../../actions/stakeActions';
import { toFormattedNumber } from '../../../helpers/format';
import { validateStakeForm } from '../../../helpers/validator';
import { getConfigKey } from '../../../services/configurationServices';
import { StakingInfo } from './StakingGrid/StakingInfo';
import './Staking.scss';

const Staking = () => {
	// Hook
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { state } = useLocation();
	const { validator = {}, amount: defaultAmount = 0 } = state || {};

	// State
	const [amount, setAmount] = useState(defaultAmount);
	const [firstLoad, setFirstLoad] = useState(true);

	// Selector
	const publicKey = useSelector(getPublicKey);
	const userDetails = useSelector(getMassagedUserDetails);
	const balance = userDetails && userDetails.balance && userDetails.balance.displayBalance;

	// Effect
	useEffect(() => {
		dispatch(fetchValidators(publicKey));
	}, [dispatch, publicKey]);

	useEffect(() => {
		validator.public_key && setFirstLoad(false);
	}, [validator.public_key]);

	// Function
	const onSearchValidator = () => {
		navigate('/searchValidator', { state: { name: 'Select Validator' } });
	};

	const formErrors = useMemo(() => {
		if (firstLoad) {
			return {};
		}
		const validatorError = validator.public_key ? {} : { validator: 'Required.' };

		const selectedValidator = {
			...validator,
			numOfDelegator:
				(validator.bidInfo &&
					validator.bidInfo.bid &&
					validator.bidInfo.bid.delegators &&
					validator.bidInfo.bid.delegators.length) ||
				0,
			hasDelegated:
				validator.bidInfo &&
				validator.bidInfo.bid &&
				validator.bidInfo.bid.delegators &&
				validator.bidInfo.bid.delegators.find((delegator) => delegator.public_key === publicKey),
		};
		return {
			...validateStakeForm({
				amount: amount,
				tokenSymbol: 'CSPR',
				balance,
				fee: getConfigKey('CSPR_AUCTION_DELEGATE_FEE'),
				minAmount:
					selectedValidator && selectedValidator.hasDelegated
						? getConfigKey('MIN_CSPR_TRANSFER')
						: getConfigKey('MIN_CSPR_DELEGATE_TO_NEW_VALIDATOR'),
				selectedValidator,
			}),
			...validatorError,
		};
	}, [amount, balance, firstLoad, publicKey, validator]);

	const onAmountChange = (newAmount) => {
		setFirstLoad(false);
		setAmount(parseFloat(newAmount));
	};

	const onStake = () => {
		if (Object.keys(formErrors).length) {
			return;
		}
		navigate('/stakeConfirm', {
			state: {
				name: 'Delegate',
				stake: { validator: validator.public_key, amount, fee: getConfigKey('CSPR_AUCTION_DELEGATE_FEE') },
			},
		});
	};

	return (
		<section className="cd_we_staking">
			<div className="cd_we_staking_inputs">
				<div className="cd_we_staking_validator">
					<div className="cd_we_staking_validator_header">
						<div className="cd_we_input_label">Validator</div>
						<div className="cd_we_input_network_fee">
							Network Fee: {getConfigKey('CSPR_AUCTION_DELEGATE_FEE')} CSPR
						</div>
					</div>
					<div className="cd_we_staking_validator_box" onClick={onSearchValidator}>
						<div className="cd_we_staking_validator_value">
							<MiddleTruncatedText>{validator.public_key}</MiddleTruncatedText>
						</div>
						<svg
							className="cd_we_staking_validator_box_arrow"
							width="10"
							height="6"
							viewBox="0 0 10 6"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M9.20711 0.792893C8.81658 0.402369 8.18342 0.402369 7.79289 0.792893L5 3.58579L2.20711 0.792893C1.81658 0.402369 1.18342 0.402369 0.792894 0.792893C0.402369 1.18342 0.402369 1.81658 0.792894 2.20711L4.29289 5.70711C4.68342 6.09763 5.31658 6.09763 5.70711 5.70711L9.20711 2.20711C9.59763 1.81658 9.59763 1.18342 9.20711 0.792893Z"
								fill="#23262F"
							/>
						</svg>
					</div>
					<div className="cd_error_text">{formErrors.validator}</div>
				</div>
				<div className="cd_we_staking_amount">
					<div className="cd_we_staking_amount_header">
						<div className="cd_we_input_label">Amount</div>
						<div>Balance: {toFormattedNumber(balance)}</div>
					</div>
					<div className="cd_we_staking_amount_text_box">
						<input type="number" value={amount} onChange={(e) => onAmountChange(e.target.value)} />
						<div
							className="cd_we_amount_max_btn"
							onClick={() => onAmountChange(balance - getConfigKey('CSPR_AUCTION_DELEGATE_FEE'))}
						>
							Max
						</div>
					</div>
					<div className="cd_error_text">{formErrors.amount}</div>
				</div>
				<Button onClick={onStake} disabled={Object.keys(formErrors).length || firstLoad}>
					Stake Now
				</Button>
			</div>

			<StakingInfo publicKey={publicKey} />
		</section>
	);
};

export default Staking;
