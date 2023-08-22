import React from 'react';
import { useSelector } from 'react-redux';
import { AccountInfo } from '@cd/web-extension/Common/Account';
import { getPublicKeyAndLoginOptions } from '@cd/selectors/user';
import OverlayLoader from '@cd/web-extension/Common/OverlayLoader';
import ListTokens from './ListTokens';
import SendAndReceiveButton from './SendAndReceiveButton';
import { News } from './News';
import './index.scss';

const WalletDetails = () => {
	// Selector
	const { publicKey } = useSelector(getPublicKeyAndLoginOptions);

	// Functions

	if (!publicKey) {
		return <OverlayLoader />;
	}

	return (
		<section className="cd_we_dashboard_page with_bottom_bar">
			<News />
			<div className="cd_we_main_content main_section">
				<AccountInfo />
				<SendAndReceiveButton />
			</div>
			<div className="cd_we_main_details sub_section hide_scroll_bar">
				<ListTokens />
			</div>
		</section>
	);
};

export default WalletDetails;
