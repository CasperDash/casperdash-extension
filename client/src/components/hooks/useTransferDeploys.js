import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAutoRefreshEffect } from './useAutoRefreshEffect';
import {
	getTransferDeploysStatus,
	updateTransferDeployStatus,
	getTransfersFromLocalStorage,
} from '../../actions/deployActions';
import { getTransfersDeploy, getPendingTransferDeployHash, getMassagedTransfers } from '../../selectors/deploy';

const mergeDeploys = (localList, remoteList) => {
	const localIds = localList.map((l) => l.deployHash);
	return [...localList, ...remoteList.filter((r) => localIds.indexOf(r.deployHash) < 0)];
};
export const useDeploysWithStatus = ({ symbol, publicKey }) => {
	const dispatch = useDispatch();

	const transfersDeployList = useSelector(getTransfersDeploy(symbol));
	const pendingTransferDeployHash = useSelector(getPendingTransferDeployHash(symbol));
	const historyTransfersDeploy = useSelector(getMassagedTransfers);

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

	return mergeDeploys(transfersDeployList, historyTransfersDeploy);
};
