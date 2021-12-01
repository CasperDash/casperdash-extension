import React from 'react';
import { CASPER_SYMBOL } from '../../../../constants/key';
import UndelegateForm from './UnDelegateForm';
import DelegateForm from './DelegateForm';

export const StakeForm = ({
	publicKey,
	defaultValidator,
	currentPrice,
	handleUndelegateToggle,
	displayBalance,
	handleToggle,
	validators,
}) => {
	return defaultValidator ? (
		<UndelegateForm
			fromAddress={publicKey}
			csprPrice={currentPrice}
			handleToggle={handleUndelegateToggle}
			balance={displayBalance}
			tokenSymbol={CASPER_SYMBOL}
			stakedValidator={defaultValidator}
		/>
	) : (
		<DelegateForm
			defaultValidator={defaultValidator}
			validators={validators}
			handleToggle={handleToggle}
			fromAddress={publicKey}
			csprPrice={currentPrice}
			balance={displayBalance}
			tokenSymbol={CASPER_SYMBOL}
		/>
	);
};

export default StakeForm;
