import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useBalanceVisible from '@cd/hooks/useBalanceVisible';

const BalanceDisplay = ({ balance, className }) => {
	const { isBalanceVisible } = useBalanceVisible();

	return (
		<span className={clsx('cd_balance-display', className)}>
			{isBalanceVisible ? (
				balance
			) : (
				'*****'
			)}
		</span>
	);
};

BalanceDisplay.propTypes = {
	balance: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default BalanceDisplay;