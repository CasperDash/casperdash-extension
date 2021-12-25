import React from 'react';
import { Table } from 'react-bootstrap';
import { toFormattedNumber } from '../../../helpers/format';

export const TokenInfo = ({ selectedToken }) => {
	return (
		<div className="cd_setting_list">
			<div className="cd_setting_list_items">
				<div className="cd_setting_items_heading_peregraph">
					<h3>Token Info</h3>
					<Table className="cd_account_info_table">
						<tbody>
							<tr>
								<td>Name</td>
								<td>
									<span>{selectedToken.name}</span>
								</td>
							</tr>
							<tr>
								<td>Symbol</td>
								<td>
									<span>{selectedToken.symbol}</span>
								</td>
							</tr>
							<tr>
								<td>Address</td>
								<td>
									<span>{selectedToken.address}</span>
								</td>
							</tr>
							<tr>
								<td>Total Supply</td>
								<td>
									{toFormattedNumber(
										selectedToken.total_supply && selectedToken.total_supply.displayValue,
									)}
								</td>
							</tr>
						</tbody>
					</Table>
				</div>
			</div>
		</div>
	);
};
