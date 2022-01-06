import memoizeOne from 'memoize-one';
import { SEND_ICON_SMALL, RECEIVE_ICON_SMALL } from '../constants/icon';

export const getTransactionIcon = (type) => {
	switch (type) {
		case 'receive':
			return RECEIVE_ICON_SMALL;

		default:
			return SEND_ICON_SMALL;
	}
};

export const enrichTransactionWithIcon = memoizeOne((transferList) => {
	return transferList.map((transfer) => {
		return { ...transfer, icon: getTransactionIcon(transfer.type) };
	});
});
