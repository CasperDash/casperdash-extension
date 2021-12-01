import React from 'react';
import { Alert } from 'react-bootstrap';
import { EXPLORER_URL } from '../../../../constants/key';

const ConfirmingTransactionsInfo = (transactions) => {
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
					href={`${EXPLORER_URL}/deploy/${transactions[0].deployHash}`}
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
