import { useSelector } from 'react-redux';
import { moteToCspr } from '../../helpers/balance';
import { getValidators } from '../../selectors/validator';

export const useStakeFromValidators = (publicKey) => {
	const validators = useSelector(getValidators);
	let result = [];
	validators.forEach((validator) => {
		if (!validator.bidInfo) {
			return;
		}
		const foundDelegator = validator.bidInfo.bid.delegators.find((delegator) => publicKey == delegator.public_key);
		if (foundDelegator) {
			result.push({
				validator: validator.public_key,
				stakedAmount: moteToCspr(foundDelegator.staked_amount),
			});
		}
	});
	return result;
};
