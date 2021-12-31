import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import casperDashLogo from 'assets/image/casperdash-red-black.png';
import SettingIcon from 'assets/image/setting.svg';
import { getUserDetails } from '../../../../actions/userActions';
import { getPublicKey } from '../../../../selectors/user';
import { useAutoRefreshEffect } from '../../../../components/hooks/useAutoRefreshEffect';
import './Header.scss';

export const Header = () => {
	// Hook
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Selector
	const publicKey = useSelector(getPublicKey);
	useAutoRefreshEffect(() => {
		if (publicKey) {
			dispatch(getUserDetails(publicKey));
		}
	}, publicKey);

	return (
		<div className="cd_we_header">
			<div className="cd_we_logo">
				<img src={casperDashLogo} alt="casperdash-logo" />
			</div>
			<div className="cd_we_settings" onClick={() => navigate('/settings', { state: { name: 'Settings' } })}>
				<SettingIcon />
			</div>
		</div>
	);
};
