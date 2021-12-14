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

export const getNFTAddressList = ({ nfts }) => {
	const tokensAddress = (nfts && nfts.address) || [];
	return [...new Set([...tokensAddress])];
};

export const getOwnNFTContractHash = createSelector(
	userDetailsSelector,
	getNFTAddressList,
	({ data = {} }, customAddresses) => {
		if (!data || !data.namedKeys || !data.namedKeys.length) {
			return [];
		}
		const nftContractAddress = data.namedKeys
			.filter((namedKey) => namedKey.name.match(/.*nft.*_contract$/g))
			.map((namedKey) => formatKeyByPrefix(namedKey.key));
		return [...new Set([...nftContractAddress, ...customAddresses])];
	},
);
