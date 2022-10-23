import { useState, useCallback } from 'react';
import { WalletDescriptor } from 'casper-storage';
import isNil from 'lodash-es/isNil';
import get from 'lodash-es/get';
import { formatAccountName } from '@cd/helpers/format';
import { getUserHDWallets, addWalletAccount } from '@cd/hooks/useServiceWorker';
import { getAccounts } from '@cd/services/userServices';
import { convertBalanceFromHex } from '@cd/helpers/balance';

const useGetWallets = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [wallets, setWallets] = useState([]);

    const loadWalletsFromStorage = useCallback(async () => {
        let hdWallets = await getUserHDWallets();
		if (hdWallets.length === 0) {
			await addWalletAccount(wallets.length, new WalletDescriptor(formatAccountName()));
			hdWallets = await getUserHDWallets();
		}

		return hdWallets;
    }, [wallets.length]);

    const loadBalanceWallets = useCallback(async(hdWallets) => {
        const publicKeys = hdWallets.map((wallet) => wallet.publicKey);
		const accounts = await getAccounts(publicKeys);

		const hdBalanceWallets = hdWallets.map((wallet) => {
			const foundAccount = accounts.find((account) => account.publicKey === wallet.publicKey && isNil(wallet.balance));

			return {
				...wallet,
				balance: foundAccount ? convertBalanceFromHex(foundAccount.balance.hex) : get(wallet, 'balance', 0),
			};
		});

		return hdBalanceWallets;
    }, []);

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
	}, [loadWalletsFromStorage, loadBalanceWallets]);

    return [wallets, loadWallets, isLoading];
};

export default useGetWallets;