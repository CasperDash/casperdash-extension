import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moteToCspr } from '@cd/helpers/balance';
import { getPendingStakes, getStakesHistory } from '@cd/selectors/stake';
import { getValidators, validatorsDetail } from '@cd/selectors/validator';
import { getTransferDeploysStatus } from '@cd/actions/deployActions';
import { getAccountDelegation } from '@cd/selectors/user';
import { getBase64IdentIcon } from '@cd/helpers/identicon';
import {
	ENTRY_POINT_DELEGATE,
	ENTRY_POINT_REDELEGATE,
	ENTRY_POINT_UNDELEGATE,
	STAKING_STATUS,
} from '@cd/constants/key';
import { fetchValidators, getStakeFromLocalStorage, updateStakeDeployStatus } from '@cd/actions/stakeActions';
import { useAutoRefreshEffect } from './useAutoRefreshEffect';

/**
 * Get staked validators and add the pending amount.
 *
 * @param {Array} validators
 * @param {Array} pendingStakes
 * @param {String} publicKey
 * @returns
 */
const getStakedValidators = (validators, pendingStakes, publicKey, accountDelegation) => {
	let stakedValidators = [];
	//const validatorDetail = details?.[]
	if (!publicKey || !validators.length) {
		return stakedValidators;
	}
	if (accountDelegation && accountDelegation.length > 0) {
		validators.forEach((validator) => {
			const foundDelegator = accountDelegation.find((delegator) => delegator.validatorPublicKey === validator.validatorPublicKey);
	
			if (!foundDelegator) {
				return;
			}
	
			const { validatorPublicKey } = validator;	
			const pendingDelegated = pendingStakes.filter(
				(stake) => stake.validator === validatorPublicKey && (
					stake.entryPoint === ENTRY_POINT_DELEGATE || stake.entryPoint === ENTRY_POINT_REDELEGATE
				),
			  );
			const pendingUndelegated = pendingStakes.filter(
				(stake) => stake.validator === validatorPublicKey && stake.entryPoint === ENTRY_POINT_UNDELEGATE,
			);
			const pendingDelegatedAmount = pendingDelegated.reduce((acc, cur) => acc + cur.amount, 0);
			const pendingUndelegatedAmount = pendingUndelegated.reduce((acc, cur) => acc + cur.amount, 0);
			let pendingAmount = 0;
			if (pendingDelegatedAmount > 0 || pendingUndelegatedAmount > 0) {
				pendingAmount = pendingDelegatedAmount > 0 ? pendingDelegatedAmount : -pendingUndelegatedAmount;
			}

			let stakedValidator = {
				validator: validatorPublicKey,
				icon: validator?.icon?.[1],
				name: validator?.name || validator.validatorPublicKey,
				stakedAmount: moteToCspr(foundDelegator.stakedAmount),
				pendingAmount,
			};
	
			stakedValidators.push(stakedValidator);
		});
	}

	pendingStakes
		.filter((stake) => stake.entryPoint === ENTRY_POINT_DELEGATE && stakedValidators.findIndex((item) => item.validator === stake.validator) < 0)
		.forEach((newStakedValidator) => {
			const foundValidator = validators.find(
				(validator) => validator.validatorPublicKey === newStakedValidator.validator,
			);

			stakedValidators.push({
				icon: foundValidator?.icon?.[1],
				name: foundValidator?.name || foundValidator?.validatorPublicKey,
				validator: newStakedValidator.validator,
				pendingAmount: newStakedValidator.amount,
			})
		}
		);

	return stakedValidators;
};

export const useStakeFromValidators = (publicKey) => {
	const dispatch = useDispatch();

	const validators = useSelector(getValidators());
	const pendingStakes = useSelector(getPendingStakes());
	const accountDelegation = useSelector(getAccountDelegation());

	useEffect(() => {
		dispatch(getStakeFromLocalStorage(publicKey));
	}, [dispatch, publicKey]);

	useAutoRefreshEffect(() => {
		if (!pendingStakes.length) {
			return;
		}
		(async () => {
			if (!publicKey) return;
			const { data } = await dispatch(getTransferDeploysStatus(pendingStakes.map((stake) => stake.deployHash)));
			if (
				data &&
				data.some(
					(item) => item.status !== STAKING_STATUS.pending && item.status !== STAKING_STATUS.undelegating,
				)
			) {
				dispatch(fetchValidators(publicKey));
				dispatch(updateStakeDeployStatus(publicKey, 'deploys.stakes', data));
			}
		})();
	}, [JSON.stringify(pendingStakes), dispatch]);

	const stakedValidators = getStakedValidators(validators, pendingStakes, publicKey, accountDelegation);

	return stakedValidators;
};

export const useStakedHistory = () => {
	const stakesHistory = useSelector(getStakesHistory());
	const { data: details } = useSelector(validatorsDetail);
	return stakesHistory.map((item) => {
		const validatorDetail = details?.[item.validator];
		return {
			validator: item.validator,
			stakedAmount: item.entryPoint === ENTRY_POINT_UNDELEGATE ? -item.amount : item.amount,
			icon: validatorDetail?.logo || getBase64IdentIcon(item.validator),
			status: item.status,
			type: item.entryPoint,
			name: validatorDetail?.name || item.validator,
			...item,
		};
	});
};
