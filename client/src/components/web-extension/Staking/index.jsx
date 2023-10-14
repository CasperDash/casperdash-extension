import React from 'react';
import { StakingBalanceInfo } from '@cd/web-extension/Staking/components/StakingBalanceInfo';
import { StakingInfo } from './StakingGrid/StakingInfo';

import './Staking.scss';

const Staking = () => {
	return (
		<section className="cd_we_staking">
			<StakingBalanceInfo />
			<StakingInfo />
		</section>
	);
};

export default Staking;
