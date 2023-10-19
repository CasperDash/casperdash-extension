import { useMutation } from '@tanstack/react-query';
import { setLocalStorageValue } from "@cd/services/localStorage";
import { useSelector } from 'react-redux';
import { getPublicKey } from '@cd/selectors/user';
import { getNetwork } from '@cd/selectors/settings';
import { getNFTHistoriesKey } from '../constants/storageKey';

export const useAddNFTHistory = (options = {}) => {
    const publicKey = useSelector(getPublicKey);
    const network = useSelector(getNetwork);

    const mutation = useMutation(
       {
            ...options,
            mutationFn: async (nftHistory) => {
                return setLocalStorageValue(publicKey, getNFTHistoriesKey(network), nftHistory, 'push');
            }
       }
    )

    return {
        ...mutation,
        addNFTHistory: mutation.mutate,
        addNFTHistoryAsync: mutation.mutateAsync,
    }
}