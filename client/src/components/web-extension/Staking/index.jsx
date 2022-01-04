import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useAutoRefreshEffect } from '../../hooks/useAutoRefreshEffect';
import { getMassagedUserDetails, getPublicKey } from '../../../selectors/user';
import { fetchValidators } from '../../../actions/stakeActions';
import { toFormattedNumber } from '../../../helpers/format';
import { CSPR_AUCTION_DELEGATE_FEE } from '../../../constants/key';
import './Staking.scss';

const Staking = () => {
	// Hook
	const dispatch = useDispatch();

	// State
	const [amount, setAmount] = useState(0);

	// Selector
	const publicKey = useSelector(getPublicKey);
	const userDetails = useSelector(getMassagedUserDetails);
	const balance = userDetails && userDetails.balance && userDetails.balance.displayBalance;

	// Effect
	useEffect(() => {
		dispatch(fetchValidators());
	});

	return (
		<section className="cd_we_staking">
			<div className="cd_we_staking_inputs">
				<div className="cd_we_staking_amount">
					<div className="cd_we_staking_amount_header">
						<div className="cd_we_input_label">Amount</div>
						<div>Balance: {toFormattedNumber(balance)}</div>
					</div>
					<div className="cd_we_staking_amount_text_box">
						<input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
						<div
							className="cd_we_amount_max_btn"
							onClick={() => setAmount(balance - CSPR_AUCTION_DELEGATE_FEE)}
						>
							Max
						</div>
					</div>
				</div>
				<div className="cd_we_staking_validator">
					<div className="cd_we_staking_validator_header">
						<div className="cd_we_input_label">Validator</div>
						<div className="cd_we_input_network_fee">Network Fee: {CSPR_AUCTION_DELEGATE_FEE} CSPR</div>
					</div>
					<div className="cd_we_staking_validator_box">
						<div className="cd_we_staking_validator_value">Validator 1</div>
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
				</div>
				<Button>Stake Now</Button>
			</div>
			<div className="cd_we_staking_info">
				<div className="cd_we_staking_info_title">Staked Information</div>
			</div>
		</section>
	);
};

export default Staking;
