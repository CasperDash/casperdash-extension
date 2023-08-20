import React from 'react';
import { getVersion } from '@cd/helpers/key';
import { getConfigKey } from '@cd/services/configurationServices';
import AboutUsIcon from '@cd/assets/image/about-us-icon.svg';
import SupportIcon from '@cd/assets/image/support-icon.svg';
import DocumentIcon from '@cd/assets/image/document-icon.svg';
import Logo from '@cd/assets/image/Logo-only.svg';
import TermsOfUseIcon from '@cd/assets/image/terms-of-use-icon.svg';
import PrivacyPolicyIcon from '@cd/assets/image/privacy-policy-icon.svg';
import SettingRow from './SettingRow';

import './AboutUs.scss';

const SETTINGS = [
	{
		name: 'Documentation',
		icon: {
			className: 'cd_we_setting_documentation',
			img: <DocumentIcon/>,
		},
		action: () => {
			chrome.tabs.create({ url: getConfigKey('DOCS_URL') || 'https://docs.casperdash.io' });
		},
	},
	{
		name: 'Support',
		icon: {
			className: 'cd_we_setting_support',
			img: <SupportIcon />,
		},
		action: () => {
			chrome.tabs.create({ url: getConfigKey('SUPPORT_URL') || 'https://t.me/CasperDash_Official' });
		},
	},
	{
		name: 'Terms of Use',
		icon: {
			className: 'cd_we_setting_support',
			img: <TermsOfUseIcon />,
		},
		action: () => {
			chrome.tabs.create({ url: getConfigKey('TERMS_URL') || 'https://casperdash.io/terms-of-use.html' });
		},
	},
	{
		name: 'Privacy Policy',
		icon: {
			className: 'cd_we_setting_support',
			img: <PrivacyPolicyIcon />,
		},
		action: () => {
			chrome.tabs.create({ url: getConfigKey('PRIVACY_URL') || 'https://casperdash.io/privacy-policy.html' });
		},
	},
	{
		name: 'About Us',
		icon: {
			className: 'cd_we_setting_support',
			img: <AboutUsIcon />,
		},
		action: () => {
			chrome.tabs.create({ url: 'https://casperdash.io' });
		},
	},
];

const AboutCasperDash = () => {
	return (
		<>
			<section className="cd_we_single_section no_bottom_bar cd_we_about_us">
				<div>
					<div className="cd_we_about_us__logo-wrapper">
						<Logo width={'64'} height={'64'}/>
					</div>
					<div className="cd_we_about_us__title">CasperDash v{getVersion()}</div>
				</div>
				<div>
					{SETTINGS.map((setting) => {
						return <SettingRow key={setting.name} setting={setting} />;
					})}
				</div>
			</section>
		</>
	);
};

export default AboutCasperDash;
