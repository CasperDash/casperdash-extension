import React, { useEffect, useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import APP_CONFIGS from '../../config';

import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import StakingAccountList from '../Common/Layout/Stake/Table';
import StakingForm from '../Common/Layout/Stake/Form';
import { MessageModal } from '../Common/Layout/Modal/MessageModal';

import { getMassagedUserDetails, getPublicKey } from '../../selectors/user';

import './style.scss';
import { getTokenAddressFromLocalStorage } from '../../actions/tokensActions';
import { getCurrentPrice } from '../../selectors/price';
import { useStakeWithStatus } from '../hooks/useStakeDeploys';
import { getValidators } from '../../selectors/validator';
import { fetchValidators } from '../../actions/stakeActions';
import { getPendingStakes } from '../../selectors/stake';

const UnlockSingerWarning = ({ title, message }) => (
	<section className="cd_staking_page">
		<HeadingModule name={title} />
		<div className="cd_staking_capser_locked">
			<div className="cd_main_message">
				<Alert variant="danger">{message}</Alert>
			</div>
		</div>
	</section>
);

const ConfirmingTransactionsInfo = (transactions) => {
	if (!transactions || !transactions.length) {
		return;
	}

	if (transactions.length === 1) {
		return (
			<Alert variant={'info'} show={!!transactions.length}>
				Confirming transaction ...{' '}
				<Alert.Link
					rel="noopner noreferrer"
					target="_blank"
					href={`${APP_CONFIGS.EXPLORER_ROOT_LINK}/deploy/${transactions[0]}`}
				>
					View on explorer
				</Alert.Link>
			</Alert>
		);
	}

	return (
		<Alert variant={'info'} show={!!transactions.length}>
			Confirming transactions ...{' '}
		</Alert>
	);
};
const Stake = () => {
	const dispatch = useDispatch();

	// State
	const [send, setSend] = useState(false);
	const [showError, setShowError] = useState(false);

	// Selector
	const publicKey = useSelector(getPublicKey);
	const currentPrice = useSelector(getCurrentPrice);
	const validators = useSelector(getValidators);
	const userDetails = useSelector(getMassagedUserDetails);
	const pendingStakes = useSelector(getPendingStakes());
	const stakingDeployList = useStakeWithStatus(publicKey);

	useEffect(() => {
		dispatch(fetchValidators());
	}, [dispatch]);

	// Function
	const handleToggle = () => {
		if (publicKey) {
			setSend(!send);
		} else {
			setShowError(true);
		}
	};

	const toggleStakingForm = send ? 'toggle_form' : '';
	const displayBalance = userDetails && userDetails.balance ? userDetails.balance.displayBalance : 0;
	if (!publicKey) {
		return (
			<UnlockSingerWarning
				title={'Staking'}
				message={'Please unlock your Casper Signer to see your delegations'}
			/>
		);
	}

	return (
		<>
			<section className="cd_staking_page">
				{ConfirmingTransactionsInfo(pendingStakes)}
				<HeadingModule name={'Staking'} />
				<div className={`cd_staking_component ${toggleStakingForm}`}>
					{pendingStakes && pendingStakes.length === 0 && (
						<Button variant="outline-danger" className="cd_btn_stake_cspr" onClick={handleToggle}>
							Stake Your CSPR
						</Button>
					)}
					<div className="cd_staking_form">
						<StakingForm
							validators={validators}
							handleToggle={handleToggle}
							fromAddress={publicKey}
							csprPrice={currentPrice}
							balance={displayBalance}
							tokenSymbol="CSPR"
						/>
					</div>
					{stakingDeployList && stakingDeployList.length > 0 && (
						<h3 className="cd_transaction_list_main_heading">
							Your Delegations
							<Link to={'/history'}>View Staking History</Link>
						</h3>
					)}
					<StakingAccountList stakingDeployList={stakingDeployList} />
				</div>
				<MessageModal
					type="Error"
					message="Please unlock your Casper Signer"
					show={showError}
					handleClose={() => setShowError(false)}
				/>
			</section>
		</>
	);
};

export default Stake;
