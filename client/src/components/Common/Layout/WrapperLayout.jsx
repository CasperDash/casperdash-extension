//Layout for wrapper pages e.g home,create wallet
import React from 'react';

export const WrapperLayout = ({ children }) => {
	return (
		<>
			<div className="cd_wrapper_logo">
				<img src="assets/image/casper-dash-beta-red-black.png" alt="round-shap" className="logo" />
			</div>
			{children}
		</>
	);
};
