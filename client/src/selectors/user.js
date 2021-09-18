import { createSelector } from 'reselect';
import { getAsyncSelectorResult } from './asyncSelector';
import { fetchUserDetails } from '../services/userServices';
import { convertBalanceFromHex } from '../helpers/balance';

export const getPublicKey = ({ user }) => {
	return user.publicKey;
};

export const [getUserDetails, isWaitingUserDetails, userDetailsError] = getAsyncSelectorResult(
	{
		async: fetchUserDetails,
		id: 'UserDetails',
	},
	[getPublicKey],
);

export const getMassagedUserDetails = createSelector(getUserDetails, (userDetails) => {
	const hexBalance = userDetails && userDetails.balance ? userDetails.balance.hex : 0;
	return {
		...userDetails,
		balance: {
			...userDetails.balance,
			mote: parseInt(hexBalance),
			displayBalance: convertBalanceFromHex(hexBalance),
		},
	};
});
