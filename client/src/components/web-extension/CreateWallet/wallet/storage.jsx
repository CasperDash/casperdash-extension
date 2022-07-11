import { StorageManager as Storage } from "casper-storage";

const onResetUserCache = async () => {
  await onSetUserHashingOptions("");
  await onSetUserInfo("");
}

const onSetLocalstorage = async (key, value) => {
  return await Storage.getInstance().set(key, value);
}

const onGetLocalstorage = async (key) => {
  return await Storage.getInstance().get(key);
}

// value: JSON-stringified
const onSetUserHashingOptions = async value => await onSetLocalstorage("casperwallet_userhashingoptions", value);

const onSetUserInfo = async value => await onSetLocalstorage("casperwallet_userinformation", value);

// Require JSON.Parse when using
const onGetUserHashingOptions = async () => await onGetLocalstorage("casperwallet_userhashingoptions");

const onGetUserInfo = async () => await onGetLocalstorage("casperwallet_userinformation");

export {
  onGetLocalstorage,
  onResetUserCache,
  onSetUserHashingOptions,
  onSetUserInfo,
  onGetUserHashingOptions,
  onGetUserInfo
}

