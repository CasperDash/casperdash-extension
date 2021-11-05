import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getLatestBlockHash } from '../../selectors/deploy';

export const useAutoRefreshEffect = (callback, dependencies) => {
	const latestBlockHash = useSelector(getLatestBlockHash);
	useEffect(callback, [...dependencies, latestBlockHash]);
};
