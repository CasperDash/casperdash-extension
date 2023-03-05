import _isEqual from 'lodash-es/isEqual';
import memoizeOne from 'memoize-one';
import * as DEFAULT_CONFIG from '../constants/key';
import { getLocalStorageValue, getNetworkStorageKey, setLocalStorageValue } from './localStorage';

// eslint-disable-next-line no-unused-vars
export const getConfigurations = memoizeOne((reload, network) => {
	return getLocalStorageValue('casperdash', getNetworkStorageKey('configurations', network)) || {};
});

/**
 * Get the value of a configuration key
 * @param key - The key of the configuration you want to get.
 * @returns The value of the key in the configuration object.
 */
export const getConfigKey = (key, network) => {
	const configs = getConfigurations(false, network);
	return configs[key] || DEFAULT_CONFIG[key];
};

/**
 * Save the configuration to local storage
 * @param [config] - The configuration object to save.
 */
export const saveConfigurationToLocalStorage = (config = {}, network) => {
	const currentConfig = getLocalStorageValue('casperdash', getNetworkStorageKey('configurations', network));

	if (!_isEqual(currentConfig, config)) {
		console.info('Update configuration');
		setLocalStorageValue('casperdash', getNetworkStorageKey('configurations', network), config, 'set');
		// reload memoizeOne
		getConfigurations(true, network);
	}
};
