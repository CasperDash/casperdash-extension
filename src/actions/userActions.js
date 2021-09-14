import { USERS } from '../store/actionTypes';
import { getAccountBalance } from '../services/CasperServices';
import { Signer } from 'casper-js-sdk';

export const getBalance = () => {
	return async (dispatch) => {
		const balance = await getAccountBalance();
		dispatch({ type: USERS.GET_ACCOUNT_BALANCE, payload: { balance: balance } });
	};
};

export const connectCasper = () => {
	return async (dispatch) => {
		const isConnected = await Signer.isConnected();
		if (!isConnected) {
			Signer.sendConnectionRequest();
			return;
		} else {
			try {
				const address = await Signer.getActivePublicKey();
				dispatch({ type: USERS.SET_USER_ADDRESS, payload: { address: address } });
				dispatch({ type: USERS.CLEAR_CONNECT_ERROR });
			} catch (error) {
				debugger;
				dispatch({ type: USERS.SET_CONNECT_ERROR, payload: { error: error.message } });
			}
		}
	};
};
