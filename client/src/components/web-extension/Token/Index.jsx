import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTokenInfoByAddress } from '../../../selectors/user';
import { toFormattedCurrency, toFormattedNumber } from '../../../helpers/format';
import { SendReceive } from '../Common/SendReceiveButtons';
import './Token.scss';

const TokenDetails = () => {
	// Hook
	const {
		state: { token = {} },
	} = useLocation();

	// Selector
	const { symbol, balance, totalPrice } = useSelector(getTokenInfoByAddress(token));

	return (
		<section className="cd_we_token_details_page">
			<div className="cd_we_token_info">
				<div className="cd_we_token_info_balance">
					<img />
					<div>{balance && toFormattedNumber(balance.displayValue)}</div>
					<div>{symbol}</div>
				</div>
				<div className="cd_we_token_info_value">{toFormattedCurrency(totalPrice)}</div>
			</div>
			<SendReceive />
		</section>
	);
};

export default TokenDetails;
