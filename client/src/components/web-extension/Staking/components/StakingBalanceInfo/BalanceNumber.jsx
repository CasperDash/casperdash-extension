import CSPRImg from '@cd/assets/image/token-icons/cspr.png';
import React from 'react';

export const BalanceNumber = ({ value }) => (
	<div className="cd_we_staking_balance_info__number">
		<img src={CSPRImg} width={10} height={10}/>
		<span>
            {value}
        </span>
	</div>
);