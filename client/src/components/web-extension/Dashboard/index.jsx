import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAutoRefreshEffect } from '../../hooks/useAutoRefreshEffect';
import { getAllTokenInfo, getPublicKey } from '../../../selectors/user';
import { getTokensAddressList } from '../../../selectors/tokens';
import { fetchTokensInfoWithBalance } from '../../../actions/tokensActions';
import { Header } from '../Common/Header';
import { SendReceive } from '../Common/SendReceive';
import Grid from '../Common/Grid';
import { AccountInfo } from '../Common/Account';
import './index.scss';

const tokensGridMetadata = {
	left: [
		{ key: 'symbol', type: 'primary' },
		{ key: 'balance.displayValue', type: 'secondary', format: 'number' },
	],
	right: [
		{ key: 'totalPrice', type: 'primary', format: 'currency' },
		{ key: 'price', type: 'secondary', format: 'currency' },
	],
};

const WalletDetails = () => {
	const dispatch = useDispatch();
	// Selector
	const allTokenInfo = useSelector(getAllTokenInfo);
	const publicKey = useSelector(getPublicKey);
	const tokensAddressList = useSelector(getTokensAddressList);

	// Effect
	useAutoRefreshEffect(() => {
		dispatch(fetchTokensInfoWithBalance(tokensAddressList, publicKey));
	}, [publicKey, JSON.stringify(tokensAddressList)]);

	return (
		<section className="cd_we_dashboard_page">
			<Header />
			<div className="cd_we_content">
				<div className="cd_we_main_content">
					<AccountInfo />
					<SendReceive />
				</div>
				<Grid data={allTokenInfo} metadata={tokensGridMetadata} />
				<div className="cd_we_action"> + Add Custom Token</div>
			</div>
		</section>
	);
};

export default WalletDetails;
