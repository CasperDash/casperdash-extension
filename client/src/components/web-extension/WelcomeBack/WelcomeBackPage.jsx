import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import _get from 'lodash-es/get';
import AuthLogin from '@cd/components/web-extension/Common/AuthLogin';
import './WelcomeBack.scss';

const WelcomeBackPage = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const redirectUrl = _get(state, 'redirectUrl', '/');

	const handleOnLoginSuccess = useCallback(() => {
		navigate(redirectUrl);
	}, [navigate, redirectUrl]);

	return (
		<section className="cd_we_page--root cd_welcome">
			<div className="cd_we_create-wallet-layout--root">
				<h2>Welcome Back!</h2>
				<div className="cd_we_create-wallet-layout--body cd_we_welcomeBack--body">
					<AuthLogin isShowDeleteAllData onLoginSuccess={handleOnLoginSuccess} />
				</div>
			</div>
		</section>
	);
};

export default WelcomeBackPage;
