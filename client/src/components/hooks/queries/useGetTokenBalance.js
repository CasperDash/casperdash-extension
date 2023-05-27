import { useQuery } from '@tanstack/react-query'
import { getBalance, getErc20Balance } from '@cd/apiServices/friendlyMarket/balance';
import Big from 'big.js';

export const useGetTokenBalance = ({publicKey, contractHash, type, decimals = 0}, options = {}) => {
    return useQuery(['token-balance', publicKey, type, contractHash], async () => {
        let result = {
            balance: 0
        };

        if (type === 'ERC20') {
            if (!contractHash) {
                return result;
            }

            result = await getErc20Balance({
                publicKey, 
                contractHash
            });
        }

        if (type === 'Native') {
            result = await getBalance({publicKey});
        }

        if (result.error) {
            return result;
        }

        return {
            ...result,
            balance: Big(result.balance).div(Big(10).pow(decimals)).round(decimals).toNumber() || 0
        }
    }, {
        ...options,
        enabled: !!publicKey && !!type && !!decimals,
    });
}