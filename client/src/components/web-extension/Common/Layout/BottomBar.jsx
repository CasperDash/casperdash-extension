import React from 'react';
import { Link } from 'react-router-dom';
import './BottomBar.scss';

const BottomBar = ({ modules, currentModule }) => {
	return (
		<>
			<div className="cd_page_bottom_bar_nav">
				<div className="cd_page_bottom_bar_item_wrapper">
					{modules.map(({ name, route, icon: IconSVG }) => (
						<div className="cd_page_bottom_bar_items" title={name} key={route}>
							<Link
								to={route}
								className={`cd_page_sidebar_link position-relative ${
									route === currentModule.route ? 'active' : ''
								}`}
							>
								<IconSVG />
							</Link>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default BottomBar;
