import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getLatestBlockHash } from '../../selectors/deploy';

/**
 * If the tab is visible, then the callback function is called
 * @param callback - The function to call when the effect is run.
 * @param dependencies - An array of dependencies that will cause the effect to re-run.
 */
export const useAutoRefreshEffect = (callback, dependencies) => {
	const latestBlockHash = useSelector(getLatestBlockHash);

	useEffect(() => {
		//only refresh if tab is active
		if (document && document.visibilityState === 'visible') {
			callback();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...dependencies, latestBlockHash]);
};
