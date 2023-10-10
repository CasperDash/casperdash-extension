import memoizeOne from 'memoize-one';
import { SEND_ICON_SMALL, RECEIVE_ICON_SMALL } from '../constants/icon';

/**
 * Get transaction icon
 * @param {string} type
 */
export const getTransactionIcon = (type) => {
	switch (type) {
		case 'receive':
			return RECEIVE_ICON_SMALL;

		default:
			return SEND_ICON_SMALL;
	}
};

/**
 * enrich transaction with Icon
 */
export const enrichTransactionWithIcon = memoizeOne((transferList) => {
	return transferList.map((transfer) => {
		return { ...transfer, icon: getTransactionIcon(transfer.type) };
	});
});

export const mapTransactionStatus = (status) => {
	switch (status) {
		case 'pending':
			return {
				label: 'Pending',
				className: 'pending',
			}
		case 'completed':
			return {
				label: 'Completed',
				className: 'completed',
			}
		case 'failed':
			return {
				label: 'Failed',
				className: 'failed',
			}
		case 'fail': // for backward compatibility
			return {
				label: 'Failed',
				className: 'failed',
			}

		default:
			return {
				label: 'Pending',
				className: 'pending',
			}
	}
}