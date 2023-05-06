
import request from '../request';

const DEFAULT_NETWORK = 'casper';
 
export const getBalance = async ({publicKey, network = DEFAULT_NETWORK}) => {
    return request.get(`/misc/balance/${publicKey}?network=${network}`);
}

export const getErc20Balance = async ({publicKey, contractHash, network = DEFAULT_NETWORK}) => {
    return request.get(`/erc20/balance/hash-${contractHash}/${publicKey}?network=${network}`);
}