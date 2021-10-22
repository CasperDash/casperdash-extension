import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { convertBalanceFromHex } from '../helpers/balance';
import { USERS } from '../store/actionTypes';

export const getPublicKey = ({ user }) => {
	return user.publicKey;
};

export const getCryptoInstance = ({ user }) => {
	return user.cryptoInstance;
};

const userDetailsSelector = getQuerySelector({ type: USERS.FETCH_USER_DETAILS });

export const getMassagedUserDetails = createSelector(userDetailsSelector, (userDetails) => {
	const data = userDetails.data || {};
	const hexBalance = data && data.balance ? data.balance.hex : 0;
	return {
		...data,
		balance: {
			...data.balance,
			mote: parseInt(hexBalance),
			displayBalance: convertBalanceFromHex(hexBalance),
		},
	};
});
