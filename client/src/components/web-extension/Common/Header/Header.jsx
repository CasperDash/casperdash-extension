import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CasperDashLogo from '@cd/assets/image/Logo-only.svg';
import SettingIcon from '@cd/assets/image/setting.svg';
import { getUserDetails } from '../../../../actions/userActions';
import { getPublicKey } from '../../../../selectors/user';
import { useAutoRefreshEffect } from '../../../../components/hooks/useAutoRefreshEffect';
import './Header.scss';

export const Header = ({ currentModule = {} }) => {
	// Hook
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Selector
	const publicKey = useSelector(getPublicKey);
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
			<div className="cd_we_page_name">{currentModule.name}</div>
			{currentModule.route === '/' && (
				<div className="cd_we_settings" onClick={() => navigate('/settings', { state: { name: 'Settings' } })}>
					<SettingIcon />
				</div>
			)}
		</div>
	);
};
