import { useState, useCallback, useRef } from 'react';
import findLastIndex from 'lodash-es/findLastIndex';
import { loadBalanceWallets } from '@cd/helpers/wallet';
import { getUserHDWallets, generateHDWallets, removeHDWalletsByIds } from '@cd/hooks/useServiceWorker';
import { MAXIMUM_GENERATE_WALLETS } from '@cd/constants/wallet';

const useGetWallets = () => {
	const preventGeneratingRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isGeneratingWallets, setIsGeneratingWallets] = useState(false);
	const [wallets, setWallets] = useState([]);

	const generateBalanceWallets = useCallback(async () => {
		const wallets = await generateHDWallets(MAXIMUM_GENERATE_WALLETS);
		const balanceWallets = await loadBalanceWallets(wallets);
		const foundLastIndex = findLastIndex(balanceWallets, wallet => {
			return parseInt(wallet.balance, 10) > 0;
		});
		// Always keep first wallet.
		const fromIndex = Math.max(foundLastIndex + 1, 1);

		const ids = balanceWallets.slice(fromIndex).map(wallet => wallet._id);
		if (ids.length > 0) {
			await removeHDWalletsByIds(ids);
		}
	}, []);

    const loadWalletsFromStorage = useCallback(async () => {
        let hdWallets = await getUserHDWallets();
		if (hdWallets.length <= 1) {
			if (!preventGeneratingRef.current) {
				setIsGeneratingWallets(true);
				await generateBalanceWallets();
				setIsGeneratingWallets(false);
				preventGeneratingRef.current = true;
			}

			hdWallets = await getUserHDWallets();
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