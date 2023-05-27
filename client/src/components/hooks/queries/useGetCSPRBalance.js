import { useQuery } from '@tanstack/react-query'
import { getBalance } from '@cd/apiServices/friendlyMarket/balance';

export const useGetCSPRBalance = (publicKey, options = {}) => {
    return useQuery(['balance', publicKey], () => getBalance({publicKey}), {
        ...options,
        enabled: !!publicKey,
    });
}