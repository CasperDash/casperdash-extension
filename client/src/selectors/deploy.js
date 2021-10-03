import { getMutationSelector, getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { DEPLOY } from '../store/actionTypes';

export const deploySelector = getMutationSelector({ type: DEPLOY.PUT_DEPLOY });

export const getLatestBlockHashSelector = getQuerySelector({ type: DEPLOY.GET_LATEST_BLOCK_HASH });

export const getLatestBlockHash = createSelector(
	getLatestBlockHashSelector,
	({ data }) => (data && data.latestBlockHash) || '',
);

//TODO: Should check by address, token may have same symbol
export const getTransfersDeploy = (symbol) => ({ deploys = {} }) => {
	const transfers = deploys.transfers || [];
	return transfers.filter((transfer) => (symbol ? transfer.symbol === symbol : true));
};
