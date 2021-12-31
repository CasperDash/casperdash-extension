import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTokenInfo } from '../../hooks/useTokensInfo';
import { getPublicKey } from '../../../selectors/user';
import { toFormattedCurrency, toFormattedNumber } from '../../../helpers/format';
import { useDeploysWithStatus } from '../../hooks/useTransferDeploys';
import { MiddleTruncatedText } from '../../Common/MiddleTruncatedText';
import { SendReceive } from '../Common/SendReceiveButtons';
import Grid from '../Common/Grid';
import './Token.scss';

const STATUS_MAPPING = [
	{ value: '', label: 'All' },
	{ value: 'pending', label: 'Pending' },
	{ value: 'fail', label: 'Fail' },
	{ value: 'success', label: 'Success' },
];

const TRANSFER_METADATA = {
	left: [
		{ key: 'deployHash', type: 'primary', component: MiddleTruncatedText },
		{ key: 'timestamp', type: 'secondary', format: 'date' },
	],
	right: [
		{ key: 'amount', type: 'primary', format: 'number' },
		{ key: 'status', type: 'secondary', valueAsClass: true },
	],
};

const TokenDetails = () => {
	// Hook
	const {
		state: { token = {} },
	} = useLocation();
	const navigate = useNavigate();
	const { tokenInfoByAddress: tokenInfo } = useTokenInfo(token);

	// State
	const [selectedStatus, setSelectedStatus] = useState(STATUS_MAPPING[0].value);

	// Selector
	const publicKey = useSelector(getPublicKey);
	//const tokenInfo = useSelector(getTokenInfoByAddress(token));
	const transferList = useDeploysWithStatus({ symbol: token.symbol, publicKey, status: selectedStatus });

	// Function
	const onTransactionClick = (deploy) => {
		navigate('/deployDetails', { state: { deploy, name: 'Transaction details' } });
	};

	return (
		<section className="cd_we_token_details_page cd_we_multi_section no_bottom_bar">
			<div className="cd_we_token_info_header main_section">
				<div className="cd_we_token_info">
					<div className="cd_we_token_info_balance">
						<img />
						<div>{tokenInfo.balance && toFormattedNumber(tokenInfo.balance.displayValue)}</div>
						<div>{tokenInfo.symbol}</div>
					</div>
					<div className="cd_we_token_info_value">~ {toFormattedCurrency(tokenInfo.totalPrice)}</div>
				</div>
				<SendReceive token={tokenInfo} />
			</div>
			<div className="cd_we_token_history sub_section">
				<div className="cd_we_token_status_filter">
					{STATUS_MAPPING.map((status, i) => (
						<div
							key={i}
							onClick={() => setSelectedStatus(status.value)}
							className={`cd_token_status ${status.value === selectedStatus ? 'active' : ''}`}
						>
							{status.label}
						</div>
					))}
				</div>
				<Grid data={transferList} metadata={TRANSFER_METADATA} onRowClick={onTransactionClick} />
			</div>
		</section>
	);
};

export default TokenDetails;
