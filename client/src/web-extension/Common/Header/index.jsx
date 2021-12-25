import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import casperDashLogo from 'assets/image/Logo-only.png';
import { getUserDetails } from '../../../actions/userActions';
import { getPublicKey } from '../../../selectors/user';
import { useAutoRefreshEffect } from '../../../components/hooks/useAutoRefreshEffect';
import './index.scss';

export const Header = () => {
	const dispatch = useDispatch();
	//Selector
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
			<div className="cd_we_settings">
				<i className="bi bi-gear" />
			</div>
		</div>
	);
};
