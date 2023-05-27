import { useQuery } from '@tanstack/react-query';
import { getPair } from '@cd/apiServices/friendlyMarket/amm';
import _isArray from 'lodash-es/isArray';

export const useGetAMMPair = (fromContractHash, toContractHash, options = {}) => {
    return useQuery(['ammPair', fromContractHash, toContractHash], async () => {
        const data = await getPair({fromContractHash, toContractHash});

        if (data.path && _isArray(data.path) && data.path.length > 0) {
            return {
                ...data,
                isUsingRouting: true
            }
        }

        return data;
    }, {
        ...options,
        enabled: !!fromContractHash && !!toContractHash,
    });
}