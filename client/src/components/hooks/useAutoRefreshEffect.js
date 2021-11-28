import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getLatestBlockHash } from '../../selectors/deploy';

export const useAutoRefreshEffect = (callback, dependencies) => {
	const latestBlockHash = useSelector(getLatestBlockHash);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(callback, [...dependencies, latestBlockHash]);
};
