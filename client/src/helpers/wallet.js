import isNil from 'lodash-es/isNil';
import { getAccounts } from '@cd/services/userServices';
import get from 'lodash-es/get';
import { convertBalanceFromHex } from './balance';

export const loadBalanceWallets = async (wallets) => {
    if (wallets.length === 0) {
        return [];
    }
    const publicKeys = wallets.map((wallet) => wallet.publicKey);
    const accounts = await getAccounts(publicKeys);

    const hdBalanceWallets = wallets.map((wallet) => {
        const foundAccount = accounts.find((account) => account.publicKey === wallet.publicKey && isNil(wallet.balance));

        return {
            ...wallet,
            balance: foundAccount ? convertBalanceFromHex(foundAccount.balance.hex) : get(wallet, 'balance', 0),
        };
    });

    return hdBalanceWallets;
}