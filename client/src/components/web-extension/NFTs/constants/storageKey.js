import { getNetworkStorageKey } from "@cd/services/localStorage"

export const getNFTHistoriesKey = (network) => {
    return getNetworkStorageKey('nftHistories', network);
}