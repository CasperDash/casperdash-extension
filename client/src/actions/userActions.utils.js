import { setChromeStorageLocal, getChromeStorageLocal } from '@cd/services/localStorage';

const getConnectedAccountChromeLocalStorage = async () => {
  try {
    return getChromeStorageLocal(["publicKey", "loginOptions"]);
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
  await setChromeStorageLocal({ key: "publicKey", value: publicKey ?? "" });
  await setChromeStorageLocal({ key: "loginOptions", value: loginOptions });
};

export {
  cacheLoginInfoToLocalStorage,
  getConnectedAccountChromeLocalStorage
}
