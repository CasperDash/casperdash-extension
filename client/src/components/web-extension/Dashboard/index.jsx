import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAutoRefreshEffect } from '../../hooks/useAutoRefreshEffect';
import { getAllTokenInfo, getPublicKey } from '../../../selectors/user';
import { getTokensAddressList } from '../../../selectors/tokens';
import { fetchTokensInfoWithBalance } from '../../../actions/tokensActions';
import { SendReceive } from '../Common/SendReceiveButtons';
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
	const navigate = useNavigate();
	// Selector
	const allTokenInfo = useSelector(getAllTokenInfo);
	const publicKey = useSelector(getPublicKey);
	const tokensAddressList = useSelector(getTokensAddressList);

	// Effect
	useAutoRefreshEffect(() => {
		dispatch(fetchTokensInfoWithBalance(tokensAddressList, publicKey));
	}, [publicKey, JSON.stringify(tokensAddressList)]);

	// Functions
	const onSelectToken = (token) => {
		navigate('/token', { state: { token, name: token.symbol } });
	};

	const onAddToken = () => {
		navigate('/addToken', {
			state: { name: 'Add Token' },
		});
	};

	return (
		<section className="cd_we_dashboard_page">
			<div className="cd_we_content">
				<div className="cd_we_main_content">
					<AccountInfo />
					<SendReceive token={allTokenInfo.find((token) => token.address === 'CSPR')} />
				</div>
				<Grid data={allTokenInfo} metadata={tokensGridMetadata} onRowClick={onSelectToken} />
				<div className="cd_we_action" onClick={onAddToken}>
					+ Add Custom Token
				</div>
			</div>
		</section>
	);
};

export default WalletDetails;
