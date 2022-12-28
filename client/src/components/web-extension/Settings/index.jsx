import React from 'react';
import Logo from '@cd/assets/image/Logo-only.svg';
import LockIcon from '@cd/assets/image/ic-lock.svg';
import VersionIcon from '@cd/assets/image/ic-version.png';
import BackupIcon from '@cd/assets/image/ic-backup.png';
import ConnectedIcon from '@cd/assets/image/connected-icon.svg';
import { lockAccount } from '@cd/actions/userActions';
import DeleteAllDataButton from '@cd/components/web-extension/Common/DeleteAllDataButton';
import { getVersion } from '@cd/helpers/key';
import SettingRow from './SettingRow';
import './index.scss';

const SETTINGS = [
	{
		name: 'About Us',
		hasMenu: true,
		icon: {
			className: 'cd_we_setting_about',
			img: <Logo />,
		},
		action: () => {
			chrome.tabs.create({ url: 'https://casperdash.io' });
		},
	},
	{
		name: 'Connected Sites',
		icon: {
			className: 'cd_we_setting_sites',
			img: <ConnectedIcon />,
		},
		action: ({ navigate }) => {
			navigate('/connectedSites', { state: { name: 'Connected Sites' } });
		},
	},
	{
		name: 'Lock',
		icon: {
			className: 'cd_we_setting_lock',
			img: <LockIcon />,
		},
		action: ({ dispatch, navigate }) => {
			dispatch(lockAccount());
			navigate('/welcomeBack');
		},
	},
	{
		name: 'Recovery Phrase',
		icon: {
			className: 'cd_we_setting_recovery_phrase',
			img: <img src={BackupIcon} />,
		},
		action: ({ navigate }) => {
			navigate('/recoveryPhrase', { state: { name: 'Recovery Phrase' } });
		},
	},
	{
		name: 'Advanced',
		icon: {
			className: 'cd_we_setting_recovery_phrase',
			img: <LockIcon />,
		},
		action: ({ navigate }) => {
			navigate('/advanced', { state: { name: 'Advanced' } });
		},
	},
	{
		name: 'Version',
		icon: {
			className: 'cd_we_setting_recovery_phrase',
			img: <img src={VersionIcon} />,
		},
		value: getVersion(),
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
