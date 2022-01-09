import _isEqual from 'lodash-es/isEqual';
import memoizeOne from 'memoize-one';
import * as DEFAULT_CONFIG from '../constants/key';
import { getLocalStorageValue, setLocalStorageValue } from './localStorage';

// eslint-disable-next-line no-unused-vars
export const getConfigurations = memoizeOne((reload) => {
	return getLocalStorageValue('casperdash', 'configurations') || {};
});

export const getConfigKey = (key) => {
	const configs = getConfigurations(false);
	return configs[key] || DEFAULT_CONFIG[key];
};

export const saveConfigurationToLocalStorage = (config = {}) => {
	const currentConfig = getLocalStorageValue('casperdash', 'configurations');

	if (!_isEqual(currentConfig, config)) {
		console.info('Update configuration');
		setLocalStorageValue('casperdash', 'configurations', config, 'set');
		// reload memoizeOne
		getConfigurations(true);
	}
};
