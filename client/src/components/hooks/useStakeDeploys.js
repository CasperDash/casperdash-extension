import { useSelector, useDispatch } from 'react-redux';
import { moteToCspr } from '../../helpers/balance';
import { getPendingStakes } from '../../selectors/stake';
import { getValidators } from '../../selectors/validator';
import { useAutoRefreshEffect } from './useAutoRefreshEffect';
import { getTransferDeploysStatus, updateTransferDeployStatus } from '../../actions/deployActions';

export const useStakeFromValidators = (publicKey) => {
	const dispatch = useDispatch();

	const validators = useSelector(getValidators);
	const pendingStakes = useSelector(getPendingStakes());

	useAutoRefreshEffect(() => {
		if (!pendingStakes.length) {
			return;
		}
		(async () => {
			const { data } = await dispatch(getTransferDeploysStatus(pendingStakes.map((stake) => stake.deployHash)));
			dispatch(updateTransferDeployStatus(publicKey, 'deploys.stakes', data));
		})();
	}, [JSON.stringify(pendingStakes), dispatch]);

	let stakedValidators = [];
	validators.forEach((validator) => {
		if (!validator.bidInfo) {
			return;
		}
		const foundDelegator = validator.bidInfo.bid.delegators.find(
			(delegator) => publicKey.toLowerCase() == delegator.public_key.toLowerCase(),
		);

		if (!foundDelegator) {
			return;
		}

		const { public_key: validatorPublicKey } = validator;
		const pendingStake = pendingStakes.find((pendingStake) => pendingStake.validator === validatorPublicKey);
		let stakedValidator = {
			validator: validatorPublicKey,
			stakedAmount: moteToCspr(foundDelegator.staked_amount),
		};
		if (pendingStake) {
			stakedValidator.pendingAmount = pendingStake.amount;
		}

		stakedValidators.push(stakedValidator);
	});
	return stakedValidators;
};
