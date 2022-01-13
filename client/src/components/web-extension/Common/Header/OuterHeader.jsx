import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackArrow from 'assets/image/back-arrow.svg';
import './OuterHeader.scss';

export const OuterHeader = () => {
	const navigate = useNavigate();
	const { state } = useLocation();

	return (
		<>
			{state && state.name && (
				<div className="cd_we_outer_header">
					<div className="cd_we_back_btn" onClick={() => navigate(-1)}>
						<BackArrow />
					</div>
					<div className="cd_we_title">{state.name}</div>
				</div>
			)}
		</>
	);
};
