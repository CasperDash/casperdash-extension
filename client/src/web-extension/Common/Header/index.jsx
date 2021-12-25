import React from 'react';
import casperDashLogo from 'assets/image/Logo-only.png';
import './index.scss';

export const Header = () => {
	return (
		<div className="cd_we_header">
			<div className="cd_we_logo">
				<image src={casperDashLogo} alt="casperdash-logo" />
			</div>
			<div className="cd_we_settings">
				<i className="bi bi-gear" />
			</div>
		</div>
	);
};
