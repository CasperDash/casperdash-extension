import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
	return (
		<section className="cd_welcome_slide_section">
			<div className="cd_welcome_slide_content container">
				<h2 className="cd_welcome_slide_heading">Welcome to CasperDash</h2>
				<p className="cd_welcome_slide_peregraph">A Casper Wallet.</p>
				<Link to={'/newwallet'} className="cd_welcome_slide_step_btns">
					Create Wallet
				</Link>
				<Link to={'/newwallet'} className="cd_welcome_slide_already_wallet">
					I already have wallet
				</Link>
			</div>
		</section>
	);
};

export default Home;
