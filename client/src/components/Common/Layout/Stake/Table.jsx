import React from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'react-bootstrap';

import './Table.scss';
import { toFormattedNumber, displayNaN } from '../../../../helpers/format';

const StakingAccountListComponent = ({ stakingDeployList = [] }) => {
	if (!stakingDeployList.length) {
		return <>Stake CSPR, earn rewards and help Capser become more secure!</>;
	}
	const total = stakingDeployList.map((stake) => stake.successAmount).reduce((prev, next) => prev + next);
	return (
		<Table className="cd_transaction_list_table cd_stake_table">
			<thead>
				<tr>
					<th className="cd_transaction_list_table_heading">Validator</th>
					<th className="cd_transaction_list_table_heading">Staked Amount</th>
					<th className="cd_transaction_list_table_heading">Pending Amount</th>
					<th className="cd_transaction_list_table_heading">Actions</th>
				</tr>
			</thead>
			<tbody>
				{stakingDeployList.map((staking) => (
					<tr key={staking.validator}>
						<td className="cd_transaction_list_validator">{staking.validator}</td>
						<td className="cd_transaction_list_amount">
							{displayNaN(toFormattedNumber(staking.successAmount))}
						</td>
						<td className="cd_transaction_list_amount">
							{displayNaN(toFormattedNumber(staking.pendingAmount))}
						</td>
						<td className="cd_transaction_list_action">
							<Button size="sm" variant="danger">
								Undelegate
							</Button>
						</td>
					</tr>
				))}
				<tr>
					<td>
						<b>Total</b>
					</td>
					<td colSpan="2">
						<span>
							<b>{toFormattedNumber(total)}</b>
						</span>
					</td>
				</tr>
			</tbody>
		</Table>
	);
};

export default connect(null, null)(StakingAccountListComponent);
