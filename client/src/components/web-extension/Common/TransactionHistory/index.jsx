import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPublicKey } from '../../../../selectors/user';
import { useDeploysWithStatus } from '../../../hooks/useTransferDeploys';
import { MiddleTruncatedText } from '../../../Common/MiddleTruncatedText';
import { enrichTransactionWithIcon } from '../../../../helpers/transaction';
import Grid from '../Grid';
import './TransactionHistory.scss';

const STATUS_MAPPING = [
	{ value: '', label: 'All' },
	{ value: 'pending', label: 'Pending' },
	{ value: 'failed', label: 'Failed' },
	{ value: 'completed', label: 'Completed' },
];

const TRANSFER_METADATA = (symbol) => ({
	left: [
		{ key: 'deployHash', type: 'primary', wrapperComponent: MiddleTruncatedText },
		{ key: 'timestamp', type: 'secondary', format: 'date' },
	],
	right: [
		{ key: 'amount', type: 'primary', format: 'number', suffix: symbol },
		{ key: 'status', type: 'secondary', valueAsClass: true },
	],
});

export const TransactionHistory = ({ symbol, className }) => {
	// Hook
	const navigate = useNavigate();

	// State
	const [selectedStatus, setSelectedStatus] = useState(STATUS_MAPPING[0].value);

	// Selector
	const publicKey = useSelector(getPublicKey);
	const transferList = useDeploysWithStatus({ symbol: symbol, publicKey, status: selectedStatus });

	// Function
	const onTransactionClick = (deploy) => {
		navigate('/deployDetails', { state: { deploy, name: 'Transaction details' } });
	};

	return (
		<div className={`cd_we_token_history ${className || ''}`}>
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
				data={enrichTransactionWithIcon(transferList)}
				metadata={TRANSFER_METADATA(symbol)}
				onRowClick={onTransactionClick}
			/>
		</div>
	);
};
