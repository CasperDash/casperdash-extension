import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { convertBalanceFromHex } from '../helpers/balance';
import { USERS } from '../store/actionTypes';
import { getCurrentPrice } from './price';
import { getMassagedTokenData } from './tokens';

export const getPublicKey = ({ user }) => {
	return user.publicKey || '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38';
};

export const userDetailsSelector = getQuerySelector({ type: USERS.FETCH_USER_DETAILS });

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

export const getAccountTotalBalanceInFiat = createSelector(
	getMassagedUserDetails,
	getCurrentPrice,
	getMassagedTokenData,
	(accountDetails, CSPRPrice, tokensData) => {
		const CSPRBalance = (accountDetails && accountDetails.balance && accountDetails.balance.displayBalance) || 0;
		const CSPRValue = CSPRPrice * CSPRBalance;
		//TODO: should get price for each token, currently no token issue on Casper blockchain and no source as well
		const tokenPrice = 0;
		const tokensValue =
			tokensData && tokensData.length
				? tokensData.reduce((out, datum) => {
						return out + ((datum && datum.balance && datum.balance.displayValue) || 0) * tokenPrice;
				  }, 0)
				: 0;
		return CSPRValue + tokensValue;
	},
);
