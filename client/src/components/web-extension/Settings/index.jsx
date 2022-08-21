import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ContactIcon from '@cd/assets/image/contact-icon.svg';
import LockIcon from '@cd/assets/image/lock-icon.svg';
import ArrowIcon from '@cd/assets/image/bold-arrow-icon.svg';
import { onClearPublicKey, lockAccount } from '@cd/actions/userActions';
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
		action: ({dispatch, navigate}) => {
			dispatch(onClearPublicKey());
			navigate('/welcomeBack');
		},
	},
	{
		name: 'Delete all data',
		icon: {
			className: 'cd_we_setting_lock',
			img: <LockIcon />,
		},
		action: ({dispatch, navigate}) => {
			dispatch(lockAccount());
			navigate('/connectAccount');
		},
	},
];

const Settings = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	return (
		<section className="cd_we_single_section no_bottom_bar">
			{SETTINGS.map((setting) => {
				return (
					<div className="cd_setting_row" key={setting.name} onClick={() => setting.action({dispatch, navigate})}>
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
