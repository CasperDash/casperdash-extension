import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './InnerHeader.scss';

export const InnerHeader = () => {
	const navigate = useNavigate();
	const { state } = useLocation();

	return (
		<div className="cd_we_inner_header">
			<div className="cd_we_back_btn" onClick={() => navigate(-1)}>
				<i className="bi bi-chevron-left" />
			</div>
			<div className="cd_we_title">{state && state.name}</div>
		</div>
	);
};
