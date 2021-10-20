//Layout for wrapper pages e.g home,create wallet
import React from 'react';
import { Link } from 'react-router-dom';

export const WrapperLayout = ({ children }) => {
	return (
		<>
			<div className="cd_wrapper_logo">
				<Link to={'/'}>
					<img src="assets/image/casper-dash-beta-red-black.png" alt="round-shap" className="logo" />
				</Link>
			</div>
			{children}
		</>
	);
};
