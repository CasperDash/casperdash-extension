import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTokenInfoByAddress, getPublicKey } from '../../../selectors/user';
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

const mockTransfers = [
	{
		fromAddress: '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38',
		toAddress: '013efd29d46e71690ca4f62abd5050c471a16af4ef8d723c86c0cb1b4e6db5b010',
		amount: 2.5,
		fee: 0.1,
		deployHash: '119edb4286a5dff1d216f3d12a1df4fafc9fe7631f65d669ac909288ccf56087',
		status: 'success',
		timestamp: '2021-11-15T09:11:33.788Z',
		symbol: 'CSPR',
	},
	{
		fromAddress: '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38',
		toAddress: '013efd29d46e71690ca4f62abd5050c471a16af4ef8d723c86c0cb1b4e6db5b010',
		amount: 2.5,
		fee: 0.1,
		deployHash: '01e616502bb34e5f05c7e175060ff5a4c6d5dfb5c376a6c67b339a54523d4758',
		status: 'success',
		timestamp: '2021-11-15T09:13:27.772Z',
		symbol: 'CSPR',
	},
	{
		fromAddress: '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38',
		toAddress: '013efd29d46e71690ca4f62abd5050c471a16af4ef8d723c86c0cb1b4e6db5b010',
		amount: 2.5,
		fee: 0.1,
		deployHash: 'b6c35231ccfd03baf2a2fec4947602d9e1e9dc445fa12d12eae8fb900739ee3b',
		status: 'success',
		timestamp: '2021-11-20T04:35:03.835Z',
		symbol: 'CSPR',
	},
	{
		fromAddress: '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38',
		toAddress: '01e20dcfc0782d0a2fd0fe9ba03989c94c24787eff111052bc3686841f292bc11e',
		amount: 100,
		fee: 0.1,
		deployHash: '144d9b964eb31120a369567935a95671a9e67bf8dd144093f4162ae5a0e6b1e9',
		status: 'success',
		timestamp: '2021-11-23T08:30:25.828Z',
		transferId: '1',
		symbol: 'CSPR',
	},
	{
		fromAddress: '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38',
		toAddress: '013efd29d46e71690ca4f62abd5050c471a16af4ef8d723c86c0cb1b4e6db5b010',
		amount: 2.5,
		fee: 0.1,
		deployHash: 'FD9e9149dc50B675A80DD5938125a6Ea72F81E6eb2250F37CDBFB53975fbED5A',
		status: 'success',
		timestamp: '2021-11-25T14:55:29.425Z',
		transferId: 0,
		symbol: 'CSPR',
	},
];

const TRANSFER_METADATA = {
	left: [
		{ key: 'deployHash', type: 'primary', component: MiddleTruncatedText },
		{ key: 'timestamp', type: 'secondary', format: 'date' },
	],
	right: [
		{ key: 'amount', type: 'primary' },
		{ key: 'status', type: 'secondary' },
	],
};

const TokenDetails = () => {
	// Hook
	const {
		state: { token = {} },
	} = useLocation();
	const navigate = useNavigate();

	// State
	const [selectedStatus, setSelectedStatus] = useState(STATUS_MAPPING[0].value);

	// Selector
	const publicKey = useSelector(getPublicKey);
	const { symbol, balance, totalPrice } = useSelector(getTokenInfoByAddress(token));
	const transferList = useDeploysWithStatus({ symbol: token.symbol, publicKey, status: selectedStatus });

	// Function
	const onTransactionClick = (deploy) => {
		navigate('/deployDetails', { state: { deploy, name: 'Transaction details' } });
	};

	return (
		<section className="cd_we_token_details_page">
			<div className="cd_we_token_info_header">
				<div className="cd_we_token_info">
					<div className="cd_we_token_info_balance">
						<img />
						<div>{balance && toFormattedNumber(balance.displayValue)}</div>
						<div>{symbol}</div>
					</div>
					<div className="cd_we_token_info_value">{toFormattedCurrency(totalPrice)}</div>
				</div>
				<SendReceive token={token} />
			</div>
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

			<Grid
				data={transferList.length ? transferList : mockTransfers}
				metadata={TRANSFER_METADATA}
				onRowClick={onTransactionClick}
			/>
		</section>
	);
};

export default TokenDetails;
