import { useSelector, useDispatch } from 'react-redux';
import { moteToCspr } from '../../helpers/balance';
import { getPendingStakes } from '../../selectors/stake';
import { getValidators } from '../../selectors/validator';
import { useAutoRefreshEffect } from './useAutoRefreshEffect';
import { getTransferDeploysStatus } from '../../actions/deployActions';
import { ENTRY_POINT_UNDELEGATE } from '../../constants/key';
import { updateStakeDeployStatus } from '../../actions/stakeActions';

/**
 * Get staked validators and add the pending amount.
 *
 * @param {Array} validators
 * @param {Array} pendingStakes
 * @param {String} publicKey
 * @returns
 */
const getStakedValidators = (validators, pendingStakes, publicKey) => {
	let stakedValidators = [];
	validators.forEach((validator) => {
		if (!validator.bidInfo) {
			return;
		}
		const foundDelegator = validator.bidInfo.bid.delegators.find(
			(delegator) => publicKey.toLowerCase() === delegator.public_key.toLowerCase(),
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
			stakedValidator.pendingAmount =
				pendingStake.entryPoint === ENTRY_POINT_UNDELEGATE ? -pendingStake.amount : pendingStake.amount;
		}

		stakedValidators.push(stakedValidator);
	});

	pendingStakes
		.filter((stake) => stakedValidators.findIndex((item) => item.validator === stake.validator) < 0)
		.forEach((newStakedValidator) =>
			stakedValidators.push({
				validator: newStakedValidator.validator,
				pendingAmount: newStakedValidator.amount,
			}),
		);

	return stakedValidators;
};

export const useStakeFromValidators = (publicKey) => {
	const dispatch = useDispatch();

	const validators = useSelector(getValidators);
	const pendingStakes = useSelector(getPendingStakes());

	useAutoRefreshEffect(() => {
		if (!pendingStakes.length) {
			return;
		}
		(async () => {
			if (!publicKey) return;
			const { data } = await dispatch(getTransferDeploysStatus(pendingStakes.map((stake) => stake.deployHash)));
			dispatch(updateStakeDeployStatus(publicKey, 'deploys.stakes', data));
		})();
	}, [JSON.stringify(pendingStakes), dispatch]);

	const stakedValidators = getStakedValidators(validators, pendingStakes, publicKey);
	return stakedValidators;
};
