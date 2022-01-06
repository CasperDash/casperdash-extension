import React from 'react';
import { useDispatch } from 'react-redux';
import ContactIcon from 'assets/image/contact-icon.svg';
//import SiteIcon from 'assets/image/file-icon.svg';
import LockIcon from 'assets/image/lock-icon.svg';
import ArrowIcon from 'assets/image/bold-arrow-icon.svg';
import { lockAccount } from '../../../actions/userActions';
import './index.scss';

const SETTINGS = [
	{
		name: 'About Us',
		hasMenu: true,
		icon: {
			className: 'cd_we_setting_about',
			img: <ContactIcon />,
		},
		action: () => {
			chrome.tabs.create({ url: 'https://casperdash.io' });
		},
	},
	// {
	// 	name: 'Connected Sites',
	// 	hasMenu: true,
	// 	icon: {
	// 		className: 'cd_we_setting_sites',
	// 		img: <SiteIcon />,
	// 	},
	// },
	{
		name: 'Lock',
		icon: {
			className: 'cd_we_setting_lock',
			img: <LockIcon />,
		},
		action: (dispatch) => {
			dispatch(lockAccount());
		},
	},
];

const Settings = () => {
	const dispatch = useDispatch();

	return (
		<section className="cd_we_single_section no_bottom_bar">
			{SETTINGS.map((setting) => {
				return (
					<div className="cd_setting_row" key={setting.name} onClick={() => setting.action(dispatch)}>
						<div className="cd_setting_row_left">
							<div className={`cd_setting_icon ${setting.icon.className}`}>{setting.icon.img}</div>
							<div className="cd_setting_name">{setting.name}</div>
						</div>
						{setting.hasMenu && (
							<div>
								<ArrowIcon />
							</div>
						)}
					</div>
				);
			})}
		</section>
	);
};

export default Settings;
