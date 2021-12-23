import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getLatestBlockHash } from '../../selectors/deploy';

export const useAutoRefreshEffect = (callback, dependencies) => {
	const latestBlockHash = useSelector(getLatestBlockHash);

	useEffect(() => {
		//only refresh if tab is active
		if (document.visibilityState === 'visible') {
			callback();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...dependencies, latestBlockHash]);
};
