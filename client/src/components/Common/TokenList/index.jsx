import React from 'react';
import { toFormattedNumber } from '../../../helpers/format';

export const TokenList = ({ tokensInfo, onTokenClick, selectedToken }) => {
	return (
		<div className="cd_currency_column_sub_row">
			{tokensInfo.map(({ symbol, address, balance }) => {
				const isSelected = selectedToken.address === address;
				return (
					<div className="cd_add_token_column col" key={address} onClick={() => onTokenClick(address)}>
						<div
							className={`cd_add_token_inner_content cd_add_litecoin_currency ${
								isSelected ? 'active' : ''
							}`}
						>
							<div className="cd_add_token_price">
								<div className="cd_add_token_left_price">
									<h3>{symbol}</h3>
									<p>{balance && toFormattedNumber(balance.displayValue)}</p>
								</div>
								<div className="cd_add_token_right_price">
									<p>$--</p>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
