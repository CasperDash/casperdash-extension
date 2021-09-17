import { KEY_PREFIX } from '../constants/key';

const KEY_PREFIX_REGEX = new RegExp(KEY_PREFIX.map((prefix) => `^${prefix}`).join('|'));

export const formatKeyByPrefix = (key = '') => {
	return key.replace(KEY_PREFIX_REGEX, '');
};
