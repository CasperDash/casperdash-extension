import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { getAccountDelegation } from '@cd/selectors/user';
import { useMemo } from 'react';
import useBalance from '@cd/hooks/useBalance';
import { VALIDATOR_REACHED_MAXIMUM } from '@cd/constants/staking';
import { useConfiguration } from '@cd/hooks/useConfiguration';

const useYupUndelegateValidation = ({ selectedValidator, stakedAmount }) => {
	const { getConfig } = useConfiguration();
	const accountDelegation = useSelector(getAccountDelegation());
	const balance = useBalance();
	const minCSPRDelegateToNewValidator = getConfig('MIN_CSPR_DELEGATE_TO_NEW_VALIDATOR');

	const hasDelegated = useMemo(() => {
		if (!accountDelegation|| !selectedValidator?.validatorPublicKey) {
			return false;
		}

		return accountDelegation.find((delegation) => delegation.validatorPublicKey === selectedValidator.validatorPublicKey);
	}, [accountDelegation, selectedValidator]);

	return yup.object().shape({
		amount: yup
			.number()
			.required('Amount must be more than 0 CSPR')
			.test('max', `You don't have enough CSPR to pay the fee`, function(value, context) {
				let fee = getConfig('CSPR_AUCTION_UNDELEGATE_FEE');
				if (context.parent.isUsingRedelegate) {
					fee = getConfig('CSPR_AUCTION_REDELEGATE_FEE');
				}

				if (balance < fee) {
					return context.createError({
						message: `Sorry, you do not have sufficient funds in your active balance to perform the undelegation process. Please make sure you have at least ${fee} CSPR in your active balance before attempting to ${
							context?.parent.isUsingRedelegate ? 'redelegate' : 'undelegate'
						}.`,
					});
				}

				return true;
			})
			.test('min', 'Amount must be more than 0 CSPR', function(value) {
				return value > 0;
			})
			.test(
				'minByNewValidator',
				`Please note that the minimum amount for your staking is ${minCSPRDelegateToNewValidator} CSPR or more. Please adjust your amount and try again.`,
				function(value, context) {
					if (!context.parent.isUsingRedelegate) {
						return true;
					}
					return (!getConfig('DISABLE_INCREASE_STAKE') && hasDelegated) || value >= minCSPRDelegateToNewValidator;
				},
			).test(
				'maximumStakedAmount',
				function(value, context) {
					if (value <= stakedAmount) {
						return true;
					}
					return context.createError(
						{
							message: `You can only ${context?.parent.isUsingRedelegate ? 'redelegate' : 'undelegate'} up to ${stakedAmount} CSPR`,
						},
					);
				},
			)
			,
		validatorPublicKey: yup.string(),
		newValidatorPublicKey: yup
			.string()
			.test('maxDelegator', VALIDATOR_REACHED_MAXIMUM, (_value, context) => {
				if (!context.parent.isUsingRedelegate) {
					return true;
				}

				return hasDelegated || !selectedValidator?.isFullDelegator;
			}),
	});
};

export default useYupUndelegateValidation;