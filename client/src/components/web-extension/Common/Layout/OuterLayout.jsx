import React from 'react';
import { Outlet } from 'react-router-dom';
import { OuterHeader } from '../Header/OuterHeader';
import './OuterLayout.scss';

const OuterLayout = () => {
	return (
		<div className={`cd_all_pages_content`}>
			<OuterHeader />

			<div className="cd_web_extension_outer_content">
				<Outlet />
			</div>
		</div>
	);
};

export default OuterLayout;
