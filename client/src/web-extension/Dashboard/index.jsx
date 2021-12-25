import React from 'react';
import { Header } from '../Common/Header';
import { SendReceive } from '../Common/SendReceive';
import { Grid } from '../Common/Grid';
import { AccountInfo } from '../Common/Account';
import './index.scss';

const WalletDetails = () => {
	return (
		<section className="cd_we_dashboard_page">
			<Header />
			<div className="cd_we_content">
				<div className="cd_we_main_content">
					<AccountInfo />
					<SendReceive />
				</div>
				<Grid data={new Array(10).fill()} />
				<div className="cd_we_action"> + Add Custom Token</div>
			</div>
		</section>
	);
};

export default WalletDetails;
