import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLogin } from '@cd/components/web-extension/Common/AuthLogin';

import './WelcomeBack.scss';

const WelcomeBackPage = () => {
	const navigate = useNavigate();

	const handleOnLoginSuccess = () => {
		navigate('/');
	}

	return (
		<section className="cd_we_page--root">
			<h2>Welcome Back!</h2>
			<AuthLogin 
				isShowReset 
				onLoginSuccess={handleOnLoginSuccess} 
			/>
		</section>
	);
};

export default WelcomeBackPage;
