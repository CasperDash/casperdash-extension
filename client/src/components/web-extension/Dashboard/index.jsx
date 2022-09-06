import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTokenInfo } from '@cd/hooks/useTokensInfo';
import { SendReceive } from '@cd/web-extension/Common/SendReceiveButtons';
import Grid from '@cd/web-extension/Common/Grid';
import { AccountInfo } from '@cd/web-extension/Common/Account';
import { getPublicKeyAndLoginOptions } from '@cd/selectors/user';
import OverlayLoader from '@cd/web-extension/Common/OverlayLoader';
import './index.scss';

const tokensGridMetadata = {
	left: [
		{ key: 'symbol', type: 'primary' },
		{
			key: 'balance.displayValue',
			type: 'secondary',
			format: 'number',
		},
	],
	right: [
		{ key: 'totalPrice', type: 'primary', format: 'currency' },
		{ key: 'price', type: 'secondary', format: 'currency', formatOptions: { minimumFractionDigits: 4 } },
	],
};

const WalletDetails = () => {
	// Hook
	const navigate = useNavigate();
	const { allTokenInfo, isFetching } = useTokenInfo();
	const { publicKey } = useSelector(getPublicKeyAndLoginOptions);

	// Functions
	const onSelectToken = (token) => {
		navigate('/token', { state: { token, name: token.symbol } });
	};

	const onAddToken = () => {
		navigate('/addToken', {
			state: { name: 'Add Token' },
		});
	};

	if (!publicKey) {
		return <OverlayLoader />;
	}

	return (
		<section className="cd_we_dashboard_page with_bottom_bar">
			<div className="cd_we_main_content main_section">
				<AccountInfo />
				<SendReceive token={allTokenInfo.find((token) => token.address === 'CSPR')} />
			</div>
			<div className="cd_we_main_details sub_section hide_scroll_bar">
				<Grid
					data={allTokenInfo}
					metadata={tokensGridMetadata}
					onRowClick={onSelectToken}
					isLoading={isFetching}
				/>
				<div className="cd_we_action" onClick={onAddToken}>
					+ Add Custom Token
				</div>
			</div>
		</section>
	);
};

export default WalletDetails;
