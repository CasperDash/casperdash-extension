import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeadingModule from '../../Common/Layout/HeadingComponent/Heading';
import StakingAccountList from '../../Common/Layout/Stake/Table';
import { MessageModal } from '../../Common/Layout/Modal/MessageModal';
import { getMassagedUserDetails, getPublicKey } from '../../../selectors/user';
import { getCurrentPrice } from '../../../selectors/price';
import { getValidators, validatorSelector } from '../../../selectors/validator';
import { fetchValidators } from '../../../actions/stakeActions';
import { getPendingStakes } from '../../../selectors/stake';
import { useStakeFromValidators } from '../../hooks/useStakeDeploys';
import ConfirmingTransactionsInfo from '../../Common/Layout/Stake/ConfirmingTransactionsInfo';
import UnlockSingerWarning from '../../Common/Layout/Stake/UnlockSingerWarning';
import StakeForm from '../../Common/Layout/Stake/Form';
import StakeButton from './Button';
import { getExplorer } from '@cd/selectors/settings';

const Stake = () => {
	const dispatch = useDispatch();

	// State
	const [send, setSend] = useState(false);
	const [showError, setShowError] = useState(false);
	const [defaultValidator, setDefaultValidator] = useState(null);

	// Selector
	const publicKey = useSelector(getPublicKey);
	const currentPrice = useSelector(getCurrentPrice);
	const validators = useSelector(getValidators());
	const { loading: isLoading } = useSelector(validatorSelector);
	const userDetails = useSelector(getMassagedUserDetails);
	const pendingStakes = useSelector(getPendingStakes());
	const stakingDeployList = useStakeFromValidators(publicKey);

	useEffect(() => {
		dispatch(fetchValidators(publicKey));
	}, [dispatch, publicKey]);

	// Function
	const handleToggle = () => {
		if (!publicKey) {
			setShowError(true);
			return;
		}
		setSend(!send);
	};

	const handleUndelegateToggle = () => {
		if (send) {
			setDefaultValidator(null);
		}
		handleToggle();
	};

	const undelegate = (staking) => {
		if (!staking || !validators || !validators.length) {
			return;
		}

		const info = validators.find(({ public_key: publicKey }) => staking.validator === publicKey);
		setDefaultValidator({ ...staking, info });
		if (!send) {
			setSend(true);
		}
	};

	const toggleStakingForm = send ? 'toggle_form' : '';
	const displayBalance = userDetails && userDetails.balance ? userDetails.balance.displayBalance : 0;
	const isConfirmingTrans = pendingStakes && pendingStakes.length > 0;

	if (!publicKey) {
		return (
			<UnlockSingerWarning
				title={'Staking'}
				message={'Please unlock your Casper Signer to see your delegations'}
			/>
		);
	}

	const showStakeBtn = !isConfirmingTrans && validators && validators.length > 0;
	return (
		<>
			<section className="cd_staking_page">
				{ConfirmingTransactionsInfo(pendingStakes)}
				<HeadingModule name={'Staking'} />
				<div className={`cd_staking_component ${toggleStakingForm}`}>
					<StakeButton show={showStakeBtn} handleToggle={handleToggle} />
					<div className="cd_staking_form">
						<StakeForm
							defaultValidator={defaultValidator}
							publicKey={publicKey}
							validators={validators}
							currentPrice={currentPrice}
							handleUndelegateToggle={handleUndelegateToggle}
							displayBalance={displayBalance}
							handleToggle={handleToggle}
						/>
					</div>
					{stakingDeployList && stakingDeployList.length > 0 && (
						<h3 className="cd_transaction_list_main_heading">Your Delegations</h3>
					)}
					<StakingAccountList
						stakingDeployList={stakingDeployList}
						isLoading={isLoading}
						unDelegateFunc={(validator) => undelegate(validator)}
						pendingStakes={pendingStakes}
					/>
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
