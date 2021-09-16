import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/SideBar.css';

const SideBar = (props) => {
	// hide show header
	const [showSideBar, setShowSideBar] = useState(false);

	const handleToggle = () => {
		setShowSideBar(!showSideBar);
	};

	return (
		<>
			<section className={`zl_page_sidebar ${showSideBar ? 'zl_hide_sidebar' : ''}`} title={props.title}>
				<div className="zl_page_sidebar_content">
					<div className="zl_page_sidebar_logo">
						<button className="zl_page_sidebar_toggle_btn" onClick={handleToggle}>
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
						<Link to={'/dashboard'}>
							<img src="assets/image/Logo.svg" alt="logo" className="img-fluid zl_main_logo" />
							<img src="assets/image/cspr.png" alt="logo" className="img-fluid zl_mini_sidebar_logo" />
							<img
								src="assets/image/Logo-light.svg"
								alt="light-logo"
								className="img-fluid zl_light_theme_logo d-none"
							/>
						</Link>
					</div>
					<ul className="zl_page_sidebar_nav">
						<li className="zl_page_sidebar_items" title="dashboard">
							<Link to={'/dashboard'} className="zl_page_sidebar_link position-relative">
								<svg
									width="14"
									height="14"
									viewBox="0 0 14 14"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<rect x="0.10527" y="0.10527" width="4" height="4" rx="1.4" fill="#828CAE" />
									<rect x="0.10527" y="6.10527" width="4" height="4" rx="1.4" fill="#828CAE" />
									<rect x="6.10527" y="0.10527" width="4" height="4" rx="1.4" fill="#828CAE" />
									<rect x="6.10527" y="6.10527" width="7" height="7" rx="1.4" fill="#828CAE" />
								</svg>
								<span className="zl_pagesidebar_text">Dashboard</span>
							</Link>
						</li>

						<li className="zl_page_sidebar_items" title="history">
							<Link to={'/history'} className="zl_page_sidebar_link position-relative">
								<svg
									width="16"
									height="15"
									viewBox="0 0 16 15"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M7 7H0V0L2.79289 2.79289L3.85355 1.73222C4.24408 1.3417 4.87724 1.3417 5.26776 1.73222C5.65829 2.12275 5.65829 2.75591 5.26776 3.14644L4.2071 4.2071L7 7ZM15.2678 7.73224H8.26776L11.0607 10.5251L9.99999 11.5858C9.60947 11.9763 9.60947 12.6095 9.99999 13C10.3905 13.3905 11.0237 13.3905 11.4142 13L12.4749 11.9393L15.2678 14.7322V7.73224Z"
										fill="#828CAE"
									/>
								</svg>
								<span className="zl_pagesidebar_text">History</span>
							</Link>
						</li>
						<li className="zl_page_sidebar_items" title="keyManager">
							<Link to={'/keyManager'} className="zl_page_sidebar_link position-relative">
								<svg
									width="15"
									height="17"
									viewBox="0 0 15 17"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M14.2624 2.75273L7.75463 0.0507634C7.59161 -0.0169045 7.40836 -0.0169377 7.24537 0.0507634L0.737553 2.75273C0.489691 2.85566 0.328125 3.09765 0.328125 3.36603V6.65065C0.328125 11.1733 3.06171 15.2416 7.24905 16.9508C7.40989 17.0164 7.59008 17.0164 7.75095 16.9508C11.9382 15.2417 14.6719 11.1734 14.6719 6.65065V3.36603C14.6719 3.09765 14.5103 2.85566 14.2624 2.75273Z"
										fill="#828CAE"
									/>
									<path
										d="M6.76601 8.88901L9.62029 6.03477C9.8796 5.77545 10.3001 5.77542 10.5594 6.03477C10.8188 6.29412 10.8187 6.71457 10.5594 6.97389L7.23557 10.2977C6.97619 10.5571 6.55574 10.557 6.29645 10.2977L4.4406 8.44183C4.18125 8.18248 4.18125 7.76203 4.4406 7.50271C4.69995 7.2434 5.1204 7.24336 5.37972 7.50271L6.76601 8.88901Z"
										fill="#252F47"
									/>
								</svg>
								<span className="zl_pagesidebar_text">Key Manager</span>
							</Link>
						</li>
					</ul>

					<button className="zl_page_sidebar_toggle_icon" onClick={handleToggle}>
						<img src="assets/image/right-two-arrow.svg" alt="right-two-arrow" />
					</button>
				</div>
			</section>
			<button className="zl_page_sidebar_toggle_btn" onClick={handleToggle}>
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