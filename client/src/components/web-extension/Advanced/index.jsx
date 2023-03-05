import React from 'react';
import AutoLockTimer from './AutoLockTimer';
import NetworkSelector from './Network';
import './Advanced.scss';

const Advanced = () => {
	return (
		<div className="cd_we_advanced cd_we_single_section no_bottom_bar">
			<AutoLockTimer />
			<NetworkSelector />
		</div>
	);
};

export default Advanced;
