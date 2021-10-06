import { getMutationSelector, getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { DEPLOY } from '../store/actionTypes';

export const deploySelector = getMutationSelector({ type: DEPLOY.PUT_DEPLOY });

export const getLatestBlockHashSelector = getQuerySelector({ type: DEPLOY.GET_LATEST_BLOCK_HASH });

const getTransfersSelector = getQuerySelector({ type: DEPLOY.GET_DEPLOY_TRANSFERS });

export const getMassagedTransfers = createSelector(getTransfersSelector, (transfer) => {
	return transfer.data
		? transfer.data.map((d) => {
				const { deploy_hash: deployHash, amount, from, to } = d;
				return {
					amount: amount / 1000000000,
					deployHash,
					fee: 0.00001,
					fromAddress: from.replace('account-hash-', ''),
					status: 'success',
					symbol: 'CSPR',
					timestamp: '2021-10-05T09:09:00.625Z',
					toAddress: to.replace('account-hash-', ''),
				};
		  })
		: [];
});

export const getLatestBlockHash = createSelector(
	getLatestBlockHashSelector,
	({ data }) => (data && data.latestBlockHash) || '',
);

//TODO: Should check by address, token may have same symbol
export const getTransfersDeploy =
	(symbol) =>
	({ deploys = {} }) => {
		const transfers = deploys.transfers || [];
		return transfers.filter((transfer) => (symbol ? transfer.symbol === symbol : true));
	};

export const getPendingTransferDeployHash = (symbol) =>
	createSelector(getTransfersDeploy(symbol), (pendingTransferDeploys) => {
		return pendingTransferDeploys.map((deploy) => deploy.deployHash);
	});
