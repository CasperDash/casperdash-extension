import { useState, useCallback } from 'react';
import findLastIndex from 'lodash-es/findLastIndex';
import { loadBalanceWallets } from '@cd/helpers/wallet';
import { getUserHDWallets, generateHDWallets, removeHDWalletsByIds } from '@cd/hooks/useServiceWorker';

const useGetWallets = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isGeneratingWallets, setIsGeneratingWallets] = useState(false);
	const [wallets, setWallets] = useState([]);

	const generateBalanceWallets = useCallback(async () => {
		const wallets = await generateHDWallets(10);
		const balanceWallets = await loadBalanceWallets(wallets);
		const foundLastIndex = findLastIndex(balanceWallets, wallet => {
			return parseInt(wallet.balance, 10) > 0;
		});

		const ids = balanceWallets.slice(foundLastIndex + 1).map(wallet => wallet._id);
		if (ids.length > 0) {
			await removeHDWalletsByIds(ids);
		}
	}, []);

    const loadWalletsFromStorage = useCallback(async () => {
        let hdWallets = await getUserHDWallets();
		if (hdWallets.length <= 1) {
			setIsGeneratingWallets(true);
			await generateBalanceWallets();
			hdWallets = await getUserHDWallets();
			setIsGeneratingWallets(false);
		}

		return hdWallets;
    }, [generateBalanceWallets]);

	const loadWallets = useCallback(async () => {
		setIsLoading(true);
		const hdWallets = await loadWalletsFromStorage();
		setWallets(oldWallets => {
			return hdWallets.map(wallet => {
				const foundOldWallet = oldWallets.find(oldWallet => oldWallet.publicKey === wallet.publicKey);

				if (!foundOldWallet) {
					return wallet;
				}

				return {
					...foundOldWallet,
					...wallet,
				}
			})
		});

        const hdBalanceWallets = await loadBalanceWallets(hdWallets);
		setWallets(hdBalanceWallets);
		setIsLoading(false);
	}, [loadWalletsFromStorage]);

    return {wallets, loadWallets, isLoading, isGeneratingWallets};
};

export default useGetWallets;