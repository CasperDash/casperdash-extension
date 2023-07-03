import React from 'react';
import Logo from '@cd/assets/image/Logo-only.svg';
import LockIcon from '@cd/assets/image/ic-lock.svg';
import VersionIcon from '@cd/assets/image/ic-version.png';
import SupportIcon from '@cd/assets/image/support-icon.svg';
import DocumentIcon from '@cd/assets/image/document-icon.svg';
import BackupIcon from '@cd/assets/image/ic-backup.png';
import ConnectedIcon from '@cd/assets/image/connected-icon.svg';
import { lockAccount } from '@cd/actions/userActions';
import DeleteAllDataButton from '@cd/components/web-extension/Common/DeleteAllDataButton';
import { getVersion } from '@cd/helpers/key';
import { useSelector } from 'react-redux';
import { getLoginOptions } from '@cd/selectors/user';
import { CONNECTION_TYPES } from '@cd/constants/settings';
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
		connectionType: CONNECTION_TYPES.privateKey,
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
		connectionType: CONNECTION_TYPES.privateKey,
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
		connectionType: CONNECTION_TYPES.privateKey,
	},
	{
		name: 'Advanced',
		icon: {
			className: 'cd_we_setting_advanced',
			img: <LockIcon />,
		},
		action: ({ navigate }) => {
			navigate('/advanced', { state: { name: 'Advanced' } });
		},
	},
	{
		name: 'Documentation',
		icon: {
			className: 'cd_we_setting_documentation',
			img: <DocumentIcon/>,
		},
		action: () => {
			chrome.tabs.create({ url: 'https://docs.casperdash.io' });
		},
	},
	{
		name: 'Support',
		icon: {
			className: 'cd_we_setting_support',
			img: <SupportIcon />,
		},
		action: () => {
			chrome.tabs.create({ url: 'https://t.me/CasperDash_Official' });
		},
	},
	{
		name: 'Version',
		icon: {
			className: 'cd_we_setting_version',
			img: <img src={VersionIcon} />,
		},
		value: getVersion(),
	},
];

const Settings = () => {
	const loginOptions = useSelector(getLoginOptions);
	return (
		<>
			<section className="cd_we_single_section no_bottom_bar">
				<div>
					{SETTINGS.filter(
						(st) => !st.connectionType || st.connectionType === loginOptions?.connectionType,
					).map((setting) => {
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
