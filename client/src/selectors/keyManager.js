import { createSelector } from 'reselect';
import { createCustomAsyncSelector } from './asyncSelector';
import { getKeyManagerData } from '../services/keyManager';

const getPublicKey = (state) => state.user && state.user.publicKey;

const getKeyManagerInfo = createCustomAsyncSelector(
	{
		async: getKeyManagerData,
		id: 'getKeyManagerResponse',
	},
	[getPublicKey],
);

export const keyManagerResult = createSelector([getKeyManagerInfo], (d) => (d.isResolved ? d.value : {}));

export const isWaitingForKeyManagerResults = createSelector([getKeyManagerInfo], (d) => d.isWaiting);

export const keyManagerResultsErrorMessage = createSelector([getKeyManagerInfo], (d) =>
	d.isRejected ? String(d.value) : null,
);
