import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	getTransferDeploysStatus,
	updateTransferDeployStatus,
	getTransfersFromLocalStorage,
} from '../../actions/deployActions';
import { getTransfersDeploy, getPendingTransferDeployHash } from '../../selectors/deploy';
import { useAutoRefreshEffect } from './useAutoRefreshEffect';

const sortByTimeStampDesc = (a, b) => b.timestamp.localeCompare(a.timestamp);

export const useDeploysWithStatus = ({ symbol, publicKey, status }) => {
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

	return transfersDeployList
		.filter(
			(transfer) => (symbol ? transfer.symbol === symbol : true) && (status ? transfer.status === status : true),
		)
		.sort(sortByTimeStampDesc);
};
