import _isEqual from 'lodash-es/isEqual';
import memoizeOne from 'memoize-one';
import * as DEFAULT_CONFIG from '../constants/key';
import { getLocalStorageValue, setLocalStorageValue } from './localStorage';

export const getConfigurations = memoizeOne(() => {
	return getLocalStorageValue('casperdash', 'configurations') || DEFAULT_CONFIG;
});

export const saveConfigurationToLocalStorage = (config = {}) => {
	const currentConfig = getLocalStorageValue('casperdash', 'configurations');

	if (!_isEqual(currentConfig, config)) {
		console.info('Update configuration');
		setLocalStorageValue('casperdash', 'configurations', config, 'set');
	}
};
