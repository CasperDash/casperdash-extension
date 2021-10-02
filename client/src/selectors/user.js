import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { convertBalanceFromHex } from '../helpers/balance';
import { USERS } from '../store/actionTypes';

export const getPublicKey = ({ user }) => {
	return user.publicKey || '01ce1a9410d7f6a78651237723df69c97dac5037a4586f89cb43f64c0cb4de34bb';
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
