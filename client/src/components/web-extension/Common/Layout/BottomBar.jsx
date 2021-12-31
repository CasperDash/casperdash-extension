import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from 'assets/image/home-icon.svg';
import NFTIcon from 'assets/image/nft-menu-icon.svg';
import StackingIcon from 'assets/image/stacking-icon.svg';
import './BottomBar.scss';

const SIDEBAR_ITEMS = [
	{
		key: 'dashboard',
		path: '/dashboard',
		name: 'Dashboard',
		icon: <HomeIcon />,
	},

	{
		key: 'NFTs',
		path: '/NFTs',
		name: 'NFTs',
		icon: <NFTIcon />,
	},
	{
		key: 'staking',
		path: '/staking',
		name: 'Staking',
		icon: <StackingIcon />,
	},
];

const BottomBar = ({ modules }) => {
	const [selectedTitle, setSelectedTitle] = useState('dashboard');

	const sideBarItems = SIDEBAR_ITEMS.filter((item) => modules.includes(item.path));

	return (
		<>
			<section title={selectedTitle}>
				<div className="cd_page_bottom_bar_nav">
					<div className="cd_page_bottom_bar_item_wrapper">
						{sideBarItems.map(({ key, path, icon }) => (
							<div
								className="cd_page_bottom_bar_items"
								title={key}
								key={key}
								onClick={() => setSelectedTitle(key)}
							>
								<Link
									to={path}
									className={`cd_page_sidebar_link position-relative ${
										key === selectedTitle ? 'active' : ''
									}`}
								>
									{icon}
								</Link>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default BottomBar;
