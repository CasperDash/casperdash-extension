import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { NFTS } from '../store/actionTypes';

export const NFTSelector = getQuerySelector({ type: NFTS.FETCH_NFTS_INFO });

export const getNFTInfo = createSelector(NFTSelector, ({ data }) => {
	return data || [];
});
