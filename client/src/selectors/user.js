import { getQuerySelector, getQuery } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { formatAccountName } from '@cd/helpers/format';
import { getConfigKey } from '../services/configurationServices';
import { convertBalanceFromHex } from '../helpers/balance';
import { getBase64IdentIcon } from '../helpers/identicon';
import { USERS } from '../store/actionTypes';
import { getCurrentPrice } from './price';
import { getMassagedTokenData } from './tokens';

const CSPR_INFO = {
	symbol: 'CSPR',
	address: 'CSPR',
	icon: '/assets/images/token-icons/cspr.png',
};

export const getPublicKeyAndLoginOptions = ({ user }) => {
	return {
		publicKey: user?.publicKey ?? '',
		loginOptions: user?.loginOptions || {},
	};
};

export const getPublicKey = ({ user }) => {
	return user.publicKey ?? '';
};

export const getAccountName = ({ user }) => {
	return formatAccountName(user.accountIndex);
};

export const getAccountIndex = ({ user }) => {
	return user.accountIndex;
};

export const getLoginOptions = ({ user }) => {
	return user.loginOptions || {};
};

export const getSelectedWallet = ({ user }) => {
	return (user.loginOptions && user.loginOptions.selectedWallet) || {};
};

export const userDetailsSelector = getQuerySelector({ type: USERS.FETCH_USER_DETAILS });

export const batchUserDetailsSelector = (publicKey) =>
	getQuerySelector({ type: USERS.FETCH_BATCH_USER_DETAILS, requestKey: publicKey });

const massageUserDetails = (userDetails) => {
	const hexBalance = userDetails && userDetails.balance ? userDetails.balance.hex : 0;
	return {
		...userDetails,
		balance: {
			...userDetails.balance,
			mote: parseInt(hexBalance),
			displayBalance: convertBalanceFromHex(hexBalance),
		},
	};
};
export const getMassagedBatchUserDetails = (listKeys) => (state) => {
	return listKeys.map((key) => {
		const { data, loading } = getQuery(state, { type: USERS.FETCH_BATCH_USER_DETAILS, requestKey: key.publicKey });
		const details = massageUserDetails(data || {});
		return { ...key, ...details, icon: getBase64IdentIcon(key.publicKey, { size: 30 }), isLoading: loading };
	});
};

// TODO: should refactor to use batch user details
export const getMassagedUserDetails = createSelector(userDetailsSelector, (userDetails) => {
	return massageUserDetails(userDetails.data || {});
});

export const getAllTokenInfo = createSelector(
	getMassagedUserDetails,
	getCurrentPrice,
	getMassagedTokenData,
	(accountDetails, CSPRPrice, tokensData) => {
		const CSPRBalance = (accountDetails && accountDetails.balance && accountDetails.balance.displayBalance) || 0;
		const CSPRInfo = {
			...CSPR_INFO,
			balance: { displayValue: CSPRBalance },
			price: CSPRPrice,
			totalPrice: CSPRPrice * CSPRBalance,
			transferFee: getConfigKey('CSPR_TRANSFER_FEE'),
			minAmount: getConfigKey('MIN_CSPR_TRANSFER'),
		};

		//TODO: should get price for each token, currently no token issue on Casper blockchain and no source as well
		// Temporary set the token price to 0
		const tokenPrice = 0;
		const tokensInfo =
			tokensData && tokensData.length
				? tokensData.map((datum) => ({
						price: tokenPrice,
						totalPrice: tokenPrice * datum.balance.displayValue,
						transferFee: getConfigKey('TOKEN_TRANSFER_FEE'),
						icon: getBase64IdentIcon(datum.address),
						...datum,
				  }))
				: [];

		return [CSPRInfo, ...tokensInfo];
	},
);

export const getAccountTotalBalanceInFiat = createSelector(getAllTokenInfo, (allTokenInfo) => {
	return allTokenInfo && allTokenInfo.length
		? allTokenInfo.reduce((out, datum) => {
				return out + datum.totalPrice;
		  }, 0)
		: 0;
});

export const getTokenInfoByAddress = (token) =>
	createSelector(getAllTokenInfo, (allTokenInfo) => {
		return token && allTokenInfo && allTokenInfo.length
			? allTokenInfo.find((info) => info.address === token.address)
			: {};
	});

export const userStakingRewardSelector = getQuerySelector({ type: USERS.FETCH_STAKING_REWARDS });
