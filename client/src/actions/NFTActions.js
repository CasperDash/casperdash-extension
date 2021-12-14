import { NFTS } from '../store/actionTypes';
import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';

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
export const fetchAllNTFContractInfoByPublicKey = (publicKey) => ({
	type: NFTS.FETCH_NFTS_CONTRACT_INFO,
	request: {
		url: `/nfts/${publicKey}/NFTContracts`,
	},
});

export const fetchNFTContractInfo = (contractAddress) => ({
	type: NFTS.FETCH_NFTS_CONTRACT_INFO,
	request: {
		url: `/nfts/contract/${contractAddress}`,
	},
});

export const addCustomNFTAddressToLocalStorage = (tokenAddress, publicKey) => {
	return (dispatch) => {
		const { nfts } = setLocalStorageValue(publicKey, 'nfts.address', tokenAddress, 'push');
		dispatch({
			type: NFTS.SET_LOCAL_STORAGE,
			payload: nfts.address || [],
		});
	};
};

/**
 * @param {string} publicKey
 * @returns
 */
export const getNFTAddressesFromLocalStorage = (publicKey) => {
	return (dispatch) => {
		const localStorageValue = getLocalStorageValue(publicKey, 'nfts.address');
		dispatch({
			type: NFTS.GET_FROM_LOCAL_STORAGE,
			payload: localStorageValue || [],
		});
	};
};
