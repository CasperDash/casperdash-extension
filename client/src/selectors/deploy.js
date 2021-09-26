import { getMutationSelector, getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { DEPLOY } from '../store/actionTypes';

export const deploySelector = getMutationSelector({ type: DEPLOY.PUT_DEPLOY });

export const getLatestBlockHashSelector = getQuerySelector({ type: DEPLOY.GET_LATEST_BLOCK_HASH });

export const getLatestBlockHash = createSelector(
	getLatestBlockHashSelector,
	({ data }) => (data && data.latestBlockHash) || '',
);
