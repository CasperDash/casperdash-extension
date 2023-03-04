import { useState, useCallback } from 'react';
import { WalletDescriptor } from 'casper-storage';
import isNil from 'lodash-es/isNil';
import get from 'lodash-es/get';
import { formatAccountName, toFormattedNumber } from '@cd/helpers/format';
import { getUserWallets, addWalletAccount } from '@cd/hooks/useServiceWorker';
import { getBathUsersDetail } from '@cd/actions/userActions';
import { convertBalanceFromHex } from '@cd/helpers/balance';
import { useDispatch } from 'react-redux';

const useGetWallets = () => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [wallets, setWallets] = useState([]);

	const loadWalletsFromStorage = useCallback(async () => {
		let hdWallets = await getUserWallets();

		// if no wallet should add one
		if (hdWallets.length === 0) {
			await addWalletAccount(0, new WalletDescriptor(formatAccountName()));
			hdWallets = await getUserWallets();
		}

		return hdWallets;
	}, []);

	const loadBalanceWallets = useCallback(
		async (hdWallets) => {
			const publicKeys = hdWallets.map((wallet) => wallet.publicKey);
			const { data: accounts } = await dispatch(getBathUsersDetail(publicKeys));

			const hdBalanceWallets = hdWallets.map((wallet) => {
				const foundAccount = accounts.find(
					(account) => account.publicKey === wallet.publicKey && isNil(wallet.balance),
				);

				return {
					...wallet,
					balance: foundAccount
						? toFormattedNumber(convertBalanceFromHex(foundAccount.balance.hex))
						: get(wallet, 'balance', 0),
				};
			});

			return hdBalanceWallets;
		},
		[dispatch],
	);

	const loadWallets = useCallback(async () => {
		setIsLoading(true);
		const hdWallets = await loadWalletsFromStorage();
		setWallets((oldWallets) => {
			return hdWallets.map((wallet) => {
				const foundOldWallet = oldWallets.find((oldWallet) => oldWallet.publicKey === wallet.publicKey);

				if (!foundOldWallet) {
					return wallet;
				}

				return {
					...foundOldWallet,
					...wallet,
				};
			});
		});

		const hdBalanceWallets = await loadBalanceWallets(hdWallets);
		setWallets(hdBalanceWallets);
		setIsLoading(false);
	}, [loadWalletsFromStorage, loadBalanceWallets]);

	return [wallets, loadWallets, isLoading];
};

export default useGetWallets;
