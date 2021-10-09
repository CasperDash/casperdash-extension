import { getMutationSelector, getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { DEPLOY } from '../store/actionTypes';
import { MOTE_RATE, KEY_PREFIX, CSPR_TRANSFER_FEE } from '../constants/key';

export const deploySelector = getMutationSelector({ type: DEPLOY.PUT_DEPLOY });

export const getLatestBlockHashSelector = getQuerySelector({ type: DEPLOY.GET_LATEST_BLOCK_HASH });

const getTransfersSelector = getQuerySelector({ type: DEPLOY.GET_DEPLOY_TRANSFERS });

export const getMassagedTransfers = createSelector(getTransfersSelector, (transfer) => {
	const accountHashPrefix = KEY_PREFIX[1];
	return transfer && transfer.data
		? transfer.data.map((d) => {
				const { deploy_hash: deployHash, amount, from, to, timestamp, id } = d;
				return {
					amount: amount / MOTE_RATE,
					deployHash,
					fee: CSPR_TRANSFER_FEE,
					fromAddress: from.replace(accountHashPrefix, ''),
					status: 'success',
					symbol: 'CSPR',
					timestamp,
					toAddress: to.replace(accountHashPrefix, ''),
					transferId: id,
				};
		  })
		: [];
});

export const getLatestBlockHash = createSelector(
	getLatestBlockHashSelector,
	({ data }) => (data && data.latestBlockHash) || '',
);

//TODO: Should check by address, token may have same symbol
export const getTransfersDeploy = (symbol) => ({ deploys = {} }) => {
	const transfers = deploys.transfers || [];
	return transfers.filter((transfer) => (symbol ? transfer.symbol === symbol : true));
};

export const getPendingTransferDeployHash = (symbol) =>
	createSelector(getTransfersDeploy(symbol), (pendingTransferDeploys) => {
		return pendingTransferDeploys.map((deploy) => deploy.deployHash);
	});
