import React from 'react';
import { useSelector } from 'react-redux';
import { getPublicKey, getAccountTotalBalanceInFiat } from '../../../selectors/user';
import { MiddleTruncatedText } from '../../../components/Common/MiddleTruncatedText';
import { toFormattedCurrency } from '../../../helpers/format';
import './index.scss';

export const AccountInfo = () => {
	//Selectors
	const publicKey = useSelector(getPublicKey);
	const totalFiatBalance = useSelector(getAccountTotalBalanceInFiat);

	return (
		<div className="cd_we_account">
			<div className="cd_we_account_name">Account 1</div>
			<div className="cd_we_account_address">
				<MiddleTruncatedText end={4}>{publicKey}</MiddleTruncatedText>
			</div>
			<div className="cd_we_account_balance">{toFormattedCurrency(totalFiatBalance)}</div>
		</div>
	);
};
