import { NFTS } from '../store/actionTypes';

/**
 * @param {string} publicKey
 * @returns {object}
 */
export const fetchNFTInfo = (publicKey, nftContracts) => ({
	type: NFTS.FETCH_NFTS_INFO,
	request: {
		url: '/nfts/getNFTsInfo',
		params: {
			publicKey,
			nftContracts,
		},
	},
});

/**
 * @param {string} publicKey
 * @returns {object}
 */
export const fetchNTFContractInfo = (publicKey) => ({
	type: NFTS.FETCH_NFTS_CONTRACT_INFO,
	request: {
		url: `/nfts/${publicKey}/NFTContracts`,
	},
});
