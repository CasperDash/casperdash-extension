import { useSelector } from 'react-redux';
import { moteToCspr } from '../../helpers/balance';
import { getValidators } from '../../selectors/validator';

export const useStakeWithStatus = (publicKey) => {
	const validators = useSelector(getValidators);
	let result = [];
	if (validators.length > 0) console.log(validators[0].bid.bid.delegators);
	validators.forEach((validator) => {
		const foundDelegator = validator.bid.bid.delegators.find((delegator) => publicKey == delegator.public_key);
		if (foundDelegator) {
			result.push({
				validator: validator.public_key,
				stakedAmount: moteToCspr(foundDelegator.staked_amount),
			});
		}
	});
	return result;
};
