import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoFullSilver from '@cd/assets/image/casperdash-beta-red-silver.png';
import logo from '@cd/assets/image/Logo-only-beta.png';
import logoFullBlack from '@cd/assets/image/casperdash-beta-red-black.png';
import rightIcon from '@cd/assets/image/right-two-arrow.svg';
import './css/SideBar.css';
const SIDEBAR_ITEMS = [
	{
		key: 'dashboard',
		path: '/dashboard',
		name: 'Dashboard',
		icon: (
			<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="0.10527" y="0.10527" width="4" height="4" rx="1.4" fill="#828CAE" />
				<rect x="0.10527" y="6.10527" width="4" height="4" rx="1.4" fill="#828CAE" />
				<rect x="6.10527" y="0.10527" width="4" height="4" rx="1.4" fill="#828CAE" />
				<rect x="6.10527" y="6.10527" width="7" height="7" rx="1.4" fill="#828CAE" />
			</svg>
		),
	},
	{
		key: 'tokens',
		path: '/tokens',
		name: 'Tokens',
		icon: (
			<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M2 0C0.895431 0 0 0.89543 0 2V11C0 12.1046 0.89543 13 2 13H11C12.1046 13 13 12.1046 13 11V2C13 0.895431 12.1046 0 11 0H2ZM7.5 5C6.67157 5 6 5.67157 6 6.5C6 7.32843 6.67157 8 7.5 8H9.5C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5H7.5Z"
					fill="#828CAE"
				/>
			</svg>
		),
	},

	{
		key: 'history',
		path: '/history',
		name: 'History',
		icon: (
			<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M7 7H0V0L2.79289 2.79289L3.85355 1.73222C4.24408 1.3417 4.87724 1.3417 5.26776 1.73222C5.65829 2.12275 5.65829 2.75591 5.26776 3.14644L4.2071 4.2071L7 7ZM15.2678 7.73224H8.26776L11.0607 10.5251L9.99999 11.5858C9.60947 11.9763 9.60947 12.6095 9.99999 13C10.3905 13.3905 11.0237 13.3905 11.4142 13L12.4749 11.9393L15.2678 14.7322V7.73224Z"
					fill="#828CAE"
				/>
			</svg>
		),
	},
	{
		key: 'NFTs',
		path: '/NFTs',
		name: 'NFTs',
		icon: (
			<svg
				version="1.0"
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="15"
				viewBox="0 0 256.000000 256.000000"
				preserveAspectRatio="xMidYMid meet"
			>
				<g transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)" fill="#828CAE" stroke="none">
					<path
						d="M812 2126 c-307 -153 -456 -233 -471 -252 -21 -27 -21 -30 -21 -594
0 -564 0 -567 21 -594 24 -30 904 -476 939 -476 35 0 915 446 939 476 21 27
21 30 21 594 0 564 0 567 -21 594 -24 30 -904 476 -939 476 -11 0 -221 -101
-468 -224z m843 -193 l375 -188 0 -465 0 -465 -375 -188 -375 -187 -375 187
-375 188 0 465 0 465 373 187 c204 103 373 187 374 187 2 1 172 -83 378 -186z"
					/>
					<path
						d="M1118 1903 c-15 -10 -31 -24 -35 -33 -5 -8 -10 -161 -13 -340 l-5
-325 -120 235 c-101 198 -125 238 -153 254 -29 16 -39 17 -73 7 -27 -8 -46
-23 -59 -44 -19 -30 -20 -53 -20 -377 0 -323 1 -347 19 -376 25 -41 80 -61
121 -44 57 24 65 42 70 167 l5 115 117 -234 c124 -249 139 -268 208 -268 23 0
42 10 66 34 l34 34 0 245 0 245 56 -15 c45 -11 62 -12 86 -2 83 34 92 149 15
191 -12 6 -51 19 -87 28 l-65 16 -3 122 c-1 67 1 122 5 122 5 0 123 -38 263
-85 237 -80 258 -85 293 -75 41 12 77 57 77 98 0 32 -26 79 -52 93 -41 22
-673 229 -698 229 -14 0 -37 -8 -52 -17z"
					/>
					<path
						d="M1663 1376 c-56 -25 -63 -53 -63 -258 0 -163 2 -186 19 -214 38 -63
124 -66 171 -6 18 23 20 41 20 223 l0 199 -27 30 c-33 36 -76 45 -120 26z"
					/>
				</g>
			</svg>
		),
	},
	{
		key: 'staking',
		path: '/staking',
		name: 'Staking',
		icon: (
			<svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M9.49548 17L9.49548 5.92954"
					stroke="#828CAE"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M13.515 17L13.515 2.91033"
					stroke="#828CAE"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M5.47666 17L5.47666 8.94876"
					stroke="#828CAE"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M1.45715 17L1.45715 10.9616"
					stroke="#828CAE"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M1.6745 7.32535L9.40402 1.04169"
					stroke="#828CAE"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
];

const SideBar = ({ modules }) => {
	const url = window.location.pathname;
	const title = url.split('/')[1] || 'dashboard';

	// hide show header
	const [showSideBar, setShowSideBar] = useState(false);
	const [selectedTitle, setSelectedTitle] = useState(title);

	const handleToggle = () => {
		setShowSideBar(!showSideBar);
	};

	const sideBarItems = SIDEBAR_ITEMS.filter((item) => modules.includes(item.path));

	return (
		<>
			<section className={`cd_page_sidebar ${showSideBar ? 'cd_hide_sidebar' : ''}`} title={selectedTitle}>
				<div className="cd_page_sidebar_content">
					<div className="cd_page_sidebar_logo">
						<button className="cd_page_sidebar_toggle_btn" onClick={handleToggle}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
						<Link to={'/dashboard'} onClick={() => setSelectedTitle('dashboard')}>
							<img src={logoFullSilver} alt="logo" className="img-fluid cd_main_logo" />
							<img src={logo} alt="logo" className="img-fluid cd_mini_sidebar_logo" />
							<img
								src={logoFullBlack}
								alt="light-logo"
								className="img-fluid cd_light_theme_logo d-none"
							/>
						</Link>
					</div>
					<ul className="cd_page_sidebar_nav">
						{sideBarItems.map(({ key, name, path, icon }) => (
							<li
								className="cd_page_sidebar_items"
								title={key}
								key={key}
								onClick={() => setSelectedTitle(key)}
							>
								<Link to={path} className="cd_page_sidebar_link position-relative">
									{icon}
									<span className="cd_pagesidebar_text">{name}</span>
								</Link>
							</li>
						))}
					</ul>
					<button className="cd_page_sidebar_toggle_icon" onClick={handleToggle}>
						<img src={rightIcon} alt="right-two-arrow" />
					</button>
				</div>
			</section>
			<button className="cd_page_sidebar_toggle_btn" onClick={handleToggle}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		</>
	);
};

export default SideBar;
