import { getTransferDeploysStatus } from "@cd/actions/deployActions";
import { getPublicKey } from "@cd/selectors/user";
import { getLocalStorageValue, setLocalStorageValue } from "@cd/services/localStorage";
import { useQuery } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux";
import { getNetwork } from "@cd/selectors/settings";
import { getNFTHistoriesKey } from "../constants/storageKey";

export const useGetNFTHistories = () => {
    const publicKey = useSelector(getPublicKey);
    const network = useSelector(getNetwork);
    const dispatch = useDispatch();

    return useQuery(
        {
            queryKey: ["nftHistories", publicKey, network],
            queryFn: async () => {
                const key = getNFTHistoriesKey(network);
                const nftHistories = getLocalStorageValue(publicKey, key);
                if (nftHistories.length === 0) { 
                    return [];
                }
                const pendingNftHistories = nftHistories.filter((nftHistory) => nftHistory.status === 'pending');
                const sortedNftHistories = nftHistories.sort((a, b) => {
                    return new Date(b.timestamp) - new Date(a.timestamp);
                });


                if (pendingNftHistories.length > 0) {
                    const pendingDeployHashes = pendingNftHistories.map((nftHistory) => nftHistory.deployHash);
                    const { data } = await dispatch(getTransferDeploysStatus(pendingDeployHashes));
                    const updatedNftHistories = sortedNftHistories.map((nftHistory) => {
                        const deployStatus = data?.find((deploy) => deploy.hash === nftHistory.deployHash);
                        return {
                            ...nftHistory,
                            status: deployStatus ? deployStatus.status : nftHistory.status,
                        };
                    });

                    await setLocalStorageValue(publicKey, key, updatedNftHistories, 'set');

                    return updatedNftHistories;
                }

                return sortedNftHistories;
            },
        }
    )
}