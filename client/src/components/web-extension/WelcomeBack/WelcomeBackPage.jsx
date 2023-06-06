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
		<section className="cd_we_welcome_back">
			<div className="">
				<h2>Welcome Back!</h2>
				<div className="">
					<AuthLogin isShowReset onLoginSuccess={handleOnLoginSuccess} />
				</div>
			</div>
		</section>
	);
};

export default WelcomeBackPage;
