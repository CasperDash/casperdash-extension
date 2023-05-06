import { useQuery } from '@tanstack/react-query'
import { getErc20Balance } from 'client/src/apiServices/friendlyMarket/balance/index';

export const useGetERC20Balance = ({publicKey, contractHash}, options = {}) => {
    return useQuery(['erc20-balance', contractHash, publicKey], () => getErc20Balance({
        publicKey, 
        contractHash
    }), {
        ...options,
        enabled: !!publicKey && !!contractHash,
    });
}