import _orderBy from 'lodash-es/orderBy';
import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import memoizeOne from 'memoize-one';
import Fuse from 'fuse.js';
import { NFTS } from '../store/actionTypes';
import { formatKeyByPrefix } from '../helpers/key';
import { userDetailsSelector } from './user';

const NFT_TYPE_MAPPING = {
	installContract: 'Deploy Contract',
	mint: 'Mint',
};

export const NFTSelector = getQuerySelector({ type: NFTS.FETCH_NFTS_INFO });

const getMetadataByKey = (metadata, key) => {
	const data = metadata.find((datum) => datum.key === key) || {};
	return data.value;
};

const sortNFT = memoizeOne((data = [], sortObj) => {
	const { attr, order } = sortObj;
	switch (attr) {
		case 'collection':
			//name in NFT info is collection name
			return _orderBy(data, 'nftContractName', order);
		case 'name':
			return _orderBy(data, 'nftName', order);

		default:
			return data;
	}
});

const massageNFTInfo = memoizeOne((NFTInfo = []) => {
	return NFTInfo.map((info) => {
		const nftName = getMetadataByKey(info.metadata, 'name');
		const image = getMetadataByKey(info.metadata, 'image');
		return {
			...info,
			nftName,
			image,
		};
	});
});

const searchNFT = memoizeOne((NFTInfo = [], search) => {
	if (!search) {
		return NFTInfo;
	}
	const fuse = new Fuse(NFTInfo, { keys: ['nftName', 'nftContractName'], threshold: 0.2 });
	return fuse.search(search).map((result) => result.item);
});

export const getNFTInfo = (sortObj = { attr: 'name', oder: 'asc' }, search) =>
	createSelector(NFTSelector, ({ data }) => {
		if (!data) {
			return [];
		}
		const massagedData = massageNFTInfo(data);
		const searchedInfo = searchNFT(massagedData, search);
		return sortNFT(searchedInfo, sortObj);
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
			return customAddresses || [];
		}
		const nftContractAddress = data.namedKeys
			.filter((namedKey) => namedKey.name.match(/.*nft.*_contract$/g))
			.map((namedKey) => formatKeyByPrefix(namedKey.key));
		return [...new Set([...nftContractAddress, ...customAddresses])];
	},
);

export const getPendingDeploys = ({ nfts }) => {
	if (!nfts || !nfts.deploys) {
		return {};
	}
	const pendingDeploys = Object.keys(nfts.deploys).reduce((out, key) => {
		out[key] = Array.isArray(nfts.deploys[key])
			? nfts.deploys[key].filter((deploy) => deploy.status === 'pending')
			: [];
		return out;
	}, {});
	return pendingDeploys;
};

export const getPendingDeployHashes = createSelector(getPendingDeploys, (pendingDeploys) => {
	if (!pendingDeploys) {
		return [];
	}
	return Object.keys(pendingDeploys).reduce((out, key) => {
		if (!pendingDeploys[key].length) {
			return out;
		}
		return out.concat(pendingDeploys[key].map((deploy) => deploy.hash));
	}, []);
});

export const getNFTDeployHistory = ({ nfts }) => {
	if (!nfts || !nfts.deploys) {
		return [];
	}
	const nftDeploys = Object.keys(nfts.deploys).map((key) => {
		return nfts.deploys[key] && nfts.deploys[key].length
			? nfts.deploys[key].map((deploy) => {
					return { ...deploy, type: NFT_TYPE_MAPPING[key] };
			  })
			: [];
	});
	return nftDeploys.flat();
};
