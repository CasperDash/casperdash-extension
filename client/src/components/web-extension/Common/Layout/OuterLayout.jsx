import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { OuterHeader } from '@cd/web-extension/Common/Header/OuterHeader';
import './OuterLayout.scss';

const OuterLayout = () => {
	const [header, setHeader] = useState(undefined);
	const { pathname } = useLocation();

	const isFullScreen = '/welcomeBack' === pathname;

	return (
		<div className={`cd_all_pages_content`}>
			<OuterHeader header={header} setHeader={setHeader} />

			<div className={
				clsx({
					'cd_web_extension_outer_content': !isFullScreen,
				})
			}>
				<Outlet context={[header, setHeader]} />
			</div>
		</div>
	);
};

export default OuterLayout;
