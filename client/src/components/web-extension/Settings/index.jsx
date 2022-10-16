import React from 'react';
import ContactIcon from '@cd/assets/image/contact-icon.svg';
import LockIcon from '@cd/assets/image/lock-icon.svg';
import { onClearPublicKey, lockAccount } from '@cd/actions/userActions';
import DeleteAllDataButton from '@cd/components/web-extension/Common/DeleteAllDataButton';
import SettingRow from './SettingRow';
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
		action: ({ dispatch, navigate }) => {
			dispatch(onClearPublicKey());
			navigate('/welcomeBack');
		},
	},
];

const Settings = () => {
	return (
		<>
			<section className="cd_we_single_section no_bottom_bar">
				<div>
					{SETTINGS.map((setting) => {
						return <SettingRow key={setting.name} setting={setting} />;
					})}
				</div>
				<div className="cd_setting_delete_btn">
					<DeleteAllDataButton />
				</div>
			</section>
		</>
	);
};

export default Settings;
