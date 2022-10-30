import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLogin from '@cd/components/web-extension/Common/AuthLogin';
import './WelcomeBack.scss';

const WelcomeBackPage = () => {
	const navigate = useNavigate();

	const handleOnLoginSuccess = () => {
		navigate('/');
	};

	return (
		<section className="cd_we_page--root">
			<div className="cd_we_create-wallet-layout--root">
				<h2>Welcome Back!</h2>
				<div className="cd_we_create-wallet-layout--body cd_we_welcomeBack--body">
					<AuthLogin isShowReset onLoginSuccess={handleOnLoginSuccess} />
				</div>
			</div>
		</section>
	);
};

export default WelcomeBackPage;
