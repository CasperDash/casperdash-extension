import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTransferDeploysStatus, updateTransferDeployStatus } from '../../actions/deployActions';
import { getStakeFromLocalStorage } from '../../actions/stakeActions';
import { getConfirmedStakesGroupByValidator, getPendingStakes } from '../../selectors/stake';
import { useAutoRefreshEffect } from './useAutoRefreshEffect';

export const useStakeWithStatus = (publicKey) => {
	const dispatch = useDispatch();

	const confirmedStakes = useSelector(getConfirmedStakesGroupByValidator());

	const pendingDelegations = useSelector(getPendingStakes());

	useEffect(() => {
		dispatch(getStakeFromLocalStorage(publicKey));
	}, [dispatch, publicKey]);

	useAutoRefreshEffect(() => {
		if (!pendingDelegations.length) {
			return;
		}
		(async () => {
			const { data } = await dispatch(getTransferDeploysStatus(pendingDelegations));
			dispatch(updateTransferDeployStatus(publicKey, 'deploys.stakes', data));
		})();
	}, [JSON.stringify(pendingDelegations), dispatch]);

	return confirmedStakes;
};
