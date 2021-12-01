import React from 'react';
import { Table } from 'react-bootstrap';
import { toFormattedNumber } from '../../../../helpers/format';
import CommonAction from '../../Button/CommonAction';
import { toCSPR } from '../../../../helpers/currency';

const ValidatorInfo = ({ validator, info, tokenSymbol }) => (
	<div className="cd_setting_list">
		<div className="cd_setting_list_items">
			<div className="cd_setting_items_heading_peregraph">
				<h3>Validator Info</h3>
				<Table className="cd_account_info_table">
					<tbody>
						<tr>
							<td>Public Key</td>
							<td>
								<span>{validator}</span>
							</td>
							<td className="cd_account_table_action">
								{validator && <CommonAction type="account" value={validator} />}
							</td>
						</tr>
						{info && info.bidInfo && info.bidInfo.bid && (
							<>
								<tr>
									<td>Commission Rate</td>
									<td>
										<span>{info.bidInfo.bid.delegation_rate}%</span>
									</td>
								</tr>
								<tr>
									<td>Self Stake</td>
									<td>
										<span>
											{toFormattedNumber(toCSPR(info.bidInfo.bid.staked_amount).toNumber())}{' '}
											{tokenSymbol}
										</span>
									</td>
								</tr>
							</>
						)}
					</tbody>
				</Table>
			</div>
		</div>
	</div>
);

export default ValidatorInfo;
