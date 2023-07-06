/* eslint-disable complexity */
import React, {  } from 'react';
import { useSelector } from 'react-redux';

import { getPublicKey } from '@cd/selectors/user';
import { StakingInfo } from './StakingGrid/StakingInfo';
import { StakingBalanceInfo } from './StakingBalanceInfo';

import './Staking.scss';

const Staking = () => {
	const publicKey = useSelector(getPublicKey);

	return (
		<section className="cd_we_staking">
			<StakingBalanceInfo />
			<StakingInfo publicKey={publicKey} />
		</section>
	);
};

export default Staking;
