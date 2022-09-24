import { useState, useEffect, useCallback } from 'react';
import { WalletDescriptor } from 'casper-storage';
import isNil from 'lodash-es/isNil';
import get from 'lodash-es/get';
import { formatAccountName } from '@cd/helpers/format';

import { getUserHDWallets, addWalletAccount } from '@cd/hooks/useServiceWorker';
import { getAccounts } from '@cd/services/userServices';
import { convertBalanceFromHex } from '@cd/helpers/balance';


export const useWallets = ({ isActive }) => {
	const [wallets, setWallets] = useState([]);

    const loadWalletsFromStorage = useCallback(async () => {
        let hdWallets = await getUserHDWallets();
		if (hdWallets.length === 0) {
			await addWalletAccount(wallets.length, new WalletDescriptor(formatAccountName()));
			hdWallets = await getUserHDWallets();
		}

		return hdWallets;
    }, []);

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
    }, [wallets]);

	const loadWallets = useCallback(async () => {
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
	}, [loadWalletsFromStorage, loadBalanceWallets]);

	useEffect(() => {
		if (isActive) {
			loadWallets();
		}
	}, [isActive]);

    return [wallets, loadWallets, setWallets];
};
