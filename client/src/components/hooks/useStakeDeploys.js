import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getStakeFromLocalStorage } from '../../actions/stakeActions';
import { getStakeDeploys } from '../../selectors/stake';

export const useStakeWithStatus = (publicKey) => {
	const dispatch = useDispatch();

	const pendingStakes = useSelector(getStakeDeploys());
	useEffect(() => {
		dispatch(getStakeFromLocalStorage(publicKey));
	}, [dispatch, publicKey]);
	return pendingStakes;
};
