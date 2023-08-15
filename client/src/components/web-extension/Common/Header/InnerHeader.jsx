import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackArrow from '@cd/assets/image/back-arrow.svg';
import './InnerHeader.scss';

export const InnerHeader = () => {
	const navigate = useNavigate();
	const { state = {}, pathname } = useLocation();

	const handleOnBack = () => {
		switch (pathname) {
			case '/undelegate':
				navigate('/staking', {
					replace: true,
				});

				return;
			default:
				navigate(-1);
		}
	}

	return (
		<div className="cd_we_inner_header">
			<div className="cd_we_back_btn" onClick={handleOnBack}>
				<BackArrow />
			</div>
			<div className="cd_we_title" title={state.name}>
				{state.name}
			</div>
		</div>
	);
};
