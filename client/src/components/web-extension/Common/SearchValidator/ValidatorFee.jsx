import React from 'react';
import MaxDelegatorIcon from '@cd/assets/image/ic-maxdelegators.svg';

export const FeeComponent = ({ value, isFullDelegator }) => {
	return (
		<div className="cd_we_fee">
			{value} Fee {isFullDelegator && <MaxDelegatorIcon />}
		</div>
	);
};
