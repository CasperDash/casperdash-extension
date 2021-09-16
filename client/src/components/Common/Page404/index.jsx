import React from 'react';
import { Link } from 'react-router-dom';

import { routes } from '../../../shared/constants';

const texts = {
	title: '404',
	subTitle: 'Page not found.',
	backToHomepage: 'Back to homepage',
};

const Page404Module = () => {
	return (
		<div>
			<p>{texts.title}</p>
			<p>{texts.subTitle}</p>
			<div>
				<Link to={routes.dashboardpage}>{texts.backToHomepage}</Link>
			</div>
		</div>
	);
};

export default Page404Module;
