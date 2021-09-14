import { USERS } from '../store/actionTypes';
import { getAccountBalance } from '../services/CasperServices';

export const userActions = {
	getBalance() {
		return async (dispatch) => {
			const balance = await getAccountBalance();
			dispatch({ type: USERS.GET_ACCOUNT_BALANCE, payload: { balance: balance } });
		};
	},
};
