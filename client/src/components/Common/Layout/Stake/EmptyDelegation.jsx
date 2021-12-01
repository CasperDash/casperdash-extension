import React from 'react';

const EmptyDelegation = ({ isLoading }) => (
	<div className="cd_empty_delegation_row row">
		<div className="cd_empty_delegation_section position-relative">
			<img src="assets/image/no-staking-icon.svg" alt="empty-cspr-stake" />
			<div className="cd_empty_delegation_message">
				{isLoading
					? 'Loading validators'
					: 'You do not have any delegations yet. Stake CSPR, earn rewards and help Capser become more secure!'}
			</div>
		</div>
	</div>
);

export default EmptyDelegation;
