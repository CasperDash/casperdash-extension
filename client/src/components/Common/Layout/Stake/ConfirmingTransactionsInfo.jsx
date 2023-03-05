import { getExplorer } from '@cd/selectors/settings';
import React from 'react';
import { Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ConfirmingTransactionsInfo = (transactions) => {
	const explorerUrl = useSelector(getExplorer);

	if (!transactions || !transactions.length) {
		return;
	}

	if (transactions.length === 1) {
		return (
			<Alert variant={'info'} show={!!transactions.length}>
				Confirming transaction ...{' '}
				<Alert.Link
					rel="noopner noreferrer"
					target="_blank"
					href={`${explorerUrl}/deploy/${transactions[0].deployHash}`}
				>
					View on explorer
				</Alert.Link>
			</Alert>
		);
	}

	return (
		<Alert variant={'info'} show={!!transactions.length}>
			Confirming transactions ...{' '}
		</Alert>
	);
};

export default ConfirmingTransactionsInfo;
