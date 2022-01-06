import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTokenInfo } from '../../hooks/useTokensInfo';
import { toFormattedCurrency, toFormattedNumber } from '../../../helpers/format';
import { SendReceive } from '../Common/SendReceiveButtons';
import { TransactionHistory } from '../Common/TransactionHistory';

import './Token.scss';

const TokenDetails = () => {
	// Hook
	const {
		state: { token = {} },
	} = useLocation();

	const { tokenInfoByAddress: tokenInfo } = useTokenInfo(token);

	return (
		<section className="cd_we_token_details_page cd_we_multi_section no_bottom_bar">
			<div className="cd_we_token_info_header main_section">
				<div className="cd_we_token_info">
					<div className="cd_we_token_info_balance">
						<div className="cd_we_token_info_icon">
							<img src={tokenInfo.icon} />
						</div>
						<div className="cd_we_token_info_balance_value">
							<div>{tokenInfo.balance && toFormattedNumber(tokenInfo.balance.displayValue)}</div>
							<div>{tokenInfo.symbol}</div>
						</div>
					</div>
					<div className="cd_we_token_info_value">~ {toFormattedCurrency(tokenInfo.totalPrice)}</div>
				</div>
				<SendReceive token={tokenInfo} />
			</div>
			<TransactionHistory symbol={token.symbol} className="sub_section" />
		</section>
	);
};

export default TokenDetails;
