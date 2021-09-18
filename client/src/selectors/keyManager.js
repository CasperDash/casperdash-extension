import { getAsyncSelectorResult } from './asyncSelector';
import { getKeyManagerData } from '../services/keyManager';

const getPublicKey = (state) => state.user && state.user.publicKey;

export const [keyManagerResult, isWaitingForKeyManagerResults, keyManagerResultsErrorMessage] = getAsyncSelectorResult(
	{
		async: getKeyManagerData,
		id: 'KeyManager',
	},
	[getPublicKey],
);
