import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAutoRefreshEffect } from './useAutoRefreshEffect';
import {
	getTransferDeploysStatus,
	updateTransferDeployStatus,
	getTransfersFromLocalStorage,
} from '../../actions/deployActions';
import { getTransfersDeploy, getPendingTransferDeployHash, getMassagedTransfers } from '../../selectors/deploy';

/**
 *
 * Merge local and remote deploys without duplication by deployHash.
 *
 * @param {Array} localList
 * @param {Array} remoteList
 * @returns
 */
const mergeDeploys = (localList, remoteList) => {
	const remoteIds = remoteList.map((r) => r.deployHash);
	return [...remoteList, ...localList.filter((l) => remoteIds.indexOf(l.deployHash) < 0)];
};

const sortByTimeStampDesc = (a, b) => b.timestamp.localeCompare(a.timestamp);

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

	return mergeDeploys(transfersDeployList, historyTransfersDeploy)
		.filter((transfer) => (symbol ? transfer.symbol === symbol : true))
		.sort(sortByTimeStampDesc);
};
