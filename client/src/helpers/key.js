import { KEY_PREFIX } from '../constants/key';

const KEY_PREFIX_REGEX = new RegExp(KEY_PREFIX.map((prefix) => `^${prefix}`).join('|'));

/**
 * Remove key prefix.
 * @param {String} key - Key.
 * @return {String} Key without prefix.
 */
export const formatKeyByPrefix = (key = '') => {
	return key.replace(KEY_PREFIX_REGEX, '');
};

export const getVersion = () => {
	return process.env.REACT_APP_VERSION;
};
