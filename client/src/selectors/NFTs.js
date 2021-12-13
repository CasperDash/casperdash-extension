import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { NFTS } from '../store/actionTypes';
import { formatKeyByPrefix } from '../helpers/key';
import { userDetailsSelector } from './user';

export const NFTSelector = getQuerySelector({ type: NFTS.FETCH_NFTS_INFO });

export const getNFTInfo = createSelector(NFTSelector, ({ data }) => {
	return data || [];
});

export const NFTContractInfoSelector = getQuerySelector({ type: NFTS.FETCH_NFTS_CONTRACT_INFO });

export const getNFTContracts = createSelector(NFTContractInfoSelector, ({ data = [] }) => {
	if (!data) {
		return [];
	}
	return data.map((datum) => ({ label: datum.name, value: datum.address, symbol: datum.symbol }));
});

export const getOwnNFTContractHash = createSelector(userDetailsSelector, ({ data = {} }) => {
	if (!data || !data.namedKeys || !data.namedKeys.length) {
		return [];
	}
	return data.namedKeys
		.filter((namedKey) => namedKey.name.match(/.*nft.*_contract$/g))
		.map((namedKey) => formatKeyByPrefix(namedKey.key));
});
