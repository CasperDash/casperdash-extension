import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isWaitingForConfigurationData, configurationDataError, getConfigurationData } from '../../../selectors/config';

import SideBar from '../SideBar';

const Layout = (props) => {
	const [color, setColor] = useState('zl_light_theme_active');
	const isWaitingForConfiguration = useSelector(isWaitingForConfigurationData);
	const configError = useSelector(configurationDataError);
	const configurationData = useSelector(getConfigurationData);
	useEffect(() => {
		if (typeof window !== 'undefined') {
			setColor(localStorage.getItem('themColor'));
		}
	}, []);

	useEffect(() => {
		if (configurationData) {
			localStorage.setItem('configuration', JSON.stringify(configurationData));
		}
	}, [configurationData]);

	const themHandler = (val) => {
		setColor(val ? 'zl_light_theme_active' : 'zl_page_dark_mode');
		if (typeof window !== 'undefined') {
			localStorage.setItem('themColor', val ? 'zl_light_theme_active' : 'zl_page_dark_mode');
		}
	};

	const url = window.location.pathname;
	const title = url.split('/')[1];

	return (
		<div className={`zl_all_pages_content ${color === null ? 'zl_light_theme_active' : color}`}>
			<SideBar title={title} />
			{!isWaitingForConfiguration && !configError && (
				<div className="zl_all_pages_inner_content">{props.children}</div>
			)}
		</div>
	);
};

export default Layout;
