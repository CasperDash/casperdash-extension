import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { NFTS } from '../store/actionTypes';
import { DEFAULT_NFT_ADDRESS_LIST } from '../constants/tokens';

export const getNFTAddressList = () => {
	return [...new Set([...DEFAULT_NFT_ADDRESS_LIST])];
};

export const NFTSelector = getQuerySelector({ type: NFTS.FETCH_NFTS_INFO });

export const getNFTInfo = createSelector(NFTSelector, ({ data }) => {
	return data || [];
});
