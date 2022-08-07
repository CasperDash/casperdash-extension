import { setChromeStorageLocal, getChromeStorageLocal } from '@cd/services/localStorage';

const getConnectedAccountChromeLocalStorage = async () => {
  return await getChromeStorageLocal(["publicKey", "loginOptions"]);
};

/**
 * Experimenting with Chrome Storage API
 * Testing with low-level method, so see if there's additional works required
 * Expecting to changes only in this function. No need to change any from outside
 * @param {*} publicKey
 * @param {*} loginOptions
 */
const cacheLoginInfoToLocalStorage = async (publicKey, loginOptions) => {
  console.log(`🚀 ~ >>>> SAVE::loginOptions`, loginOptions)
  console.log(`🚀 ~ >>>> SAVE::publicKey`, publicKey)
  await setChromeStorageLocal({ key: "publicKey", value: publicKey ?? "" });
  await setChromeStorageLocal({ key: "loginOptions", value: loginOptions });
};

export {
  cacheLoginInfoToLocalStorage,
  getConnectedAccountChromeLocalStorage
}
