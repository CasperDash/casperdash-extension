import React from 'react';
import stakingIcon from 'assets/image/no-staking-icon.svg';

const EmptyDelegation = ({ isLoading }) => (
	<div className="cd_empty_delegation_row row">
		<div className="cd_empty_delegation_section position-relative">
			<img src={stakingIcon} alt="empty-cspr-stake" />
			<div className="cd_empty_delegation_message">
				{isLoading
					? 'Loading validators'
					: 'You do not have any delegations yet. Stake CSPR, earn rewards and help Casper become more secure!'}
			</div>
		</div>
	</div>
);

export default EmptyDelegation;
