import { CONNECTED_ACCOUNT_STORAGE_PATH } from '@cd/constants/settings';
import {
	isUsingExtension,
	setLocalStorageValue,
	setChromeStorageLocal,
	getChromeStorageLocal,
} from '@cd/services/localStorage';
import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';

const getConnectedAccountChromeLocalStorage = async () => {
	try {
		return getChromeStorageLocal(['publicKey', 'loginOptions']);
	} catch (err) {
		return undefined;
	}
};

/**
 * Experimenting with Chrome Storage API
 * Testing with low-level method, so see if there's additional works required
 * Expecting to changes only in this function. No need to change any from outside
 * @param {*} publicKey
 * @param {*} loginOptions
 */

const cacheLoginInfoToLocalStorage = async (publicKey, loginOptions) => {
	const isChromeExtension = isUsingExtension();

	if (isChromeExtension) {
		await setChromeStorageLocal({ key: 'publicKey', value: publicKey ?? '' });
		await setChromeStorageLocal({ key: 'loginOptions', value: loginOptions });
	} else {
		setLocalStorageValue('account', CONNECTED_ACCOUNT_STORAGE_PATH, { publicKey, loginOptions }, 'set');
	}
};

const isAccountCreated = async () => {
	const account = await getConnectedAccountChromeLocalStorage();
	const loginOptions = _get(account, 'loginOptions', null);

	return !_isEmpty(loginOptions);
}

export { cacheLoginInfoToLocalStorage, getConnectedAccountChromeLocalStorage, isAccountCreated };
