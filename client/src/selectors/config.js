import { getAsyncSelectorResult } from './asyncSelector';
import { getConfiguration } from '../services/config';

export const [getConfigurationData, isWaitingForConfigurationData, configurationDataError] = getAsyncSelectorResult(
	{
		async: getConfiguration,
		id: 'Configuration',
	},
	[],
);
