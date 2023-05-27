import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CasperDashLogo from '@cd/assets/image/Logo-only.svg';
import SettingIcon from '@cd/assets/image/setting.svg';
import { getUserDetails } from '@cd/actions/userActions';
import { getPublicKey } from '@cd/selectors/user';
import { useAutoRefreshEffect } from '@cd/hooks/useAutoRefreshEffect';
import { getNetwork } from '@cd/selectors/settings';

import './Header.scss';

export const Header = ({ currentModule = {} }) => {
	// Hook
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Selector
	const publicKey = useSelector(getPublicKey);
	const network = useSelector(getNetwork);
	const displayNetwork = network === 'casper' ? 'mainnet' : 'testnet';
	const shouldRenderSettings = Boolean(publicKey && currentModule.route === '/');

	useAutoRefreshEffect(() => {
		if (publicKey) {
			dispatch(getUserDetails(publicKey));
		}
	}, [publicKey]);

	return (
		<div className={`cd_we_header ${currentModule.route && currentModule.route.replace('/', '')}`}>
			<div className="cd_we_logo">
				<CasperDashLogo />
			</div>
			<div className="cd_we_page_name">
				<span>{currentModule.name}</span>
				<span className={`cd_we_network ${displayNetwork}`}>{displayNetwork}</span>
			</div>
			{shouldRenderSettings && (
				<div className="cd_we_settings" onClick={() => navigate('/settings', { state: { name: 'Settings' } })}>
					<SettingIcon />
				</div>
			)}
		</div>
	);
};
