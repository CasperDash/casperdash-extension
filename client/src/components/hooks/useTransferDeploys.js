import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAutoRefreshEffect } from './useAutoRefreshEffect';
import {
	getTransferDeploysStatus,
	updateTransferDeployStatus,
	getTransfersFromLocalStorage,
} from '../../actions/deployActions';
import { getTransfersDeploy, getPendingTransferDeployHash } from '../../selectors/deploy';

export const useDeploysWidthStatus = ({ symbol, publicKey }) => {
	const dispatch = useDispatch();

	const transfersDeployList = useSelector(getTransfersDeploy(symbol));
	const pendingTransferDeployHash = useSelector(getPendingTransferDeployHash(symbol));

	useEffect(() => {
		dispatch(getTransfersFromLocalStorage(publicKey));
	}, [dispatch, publicKey]);

	useAutoRefreshEffect(() => {
		if (pendingTransferDeployHash.length) {
			(async () => {
				const { data } = await dispatch(getTransferDeploysStatus(pendingTransferDeployHash));
				dispatch(updateTransferDeployStatus(publicKey, 'deploys.transfers', data));
			})();
		}
	}, [JSON.stringify(pendingTransferDeployHash), dispatch]);

	return transfersDeployList;
};
