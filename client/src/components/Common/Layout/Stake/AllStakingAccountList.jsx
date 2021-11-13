import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';

const StakingAccountListComponent = ({ stakingDeployList = [] }) => {
	return (
		<>
				<Table className="cd_transaction_list_table">
					<thead>
						<tr>
							<th className="cd_transaction_list_table_heading">Validator</th>
							<th className="cd_transaction_list_table_heading">Amount</th>
							<th className="cd_transaction_list_table_heading">Status</th>
							<th className="cd_transaction_list_table_heading">Actions</th>
						</tr>
					</thead>
					<tbody>
						{stakingDeployList.map((staking, i) => (
							<tr key={staking.deployHash}>
								<td className="cd_transaction_list_name">{staking.validator}</td>
								<td className="cd_transaction_list_id">{staking.amount}</td>
								<td
									className={`cd_transaction_${
										staking.status || 'pending'
									} cd_transaction_list_status`}
								>
									{staking.status || 'pending'}
								</td>
							</tr>
						))}
					</tbody>
				</Table>
		</>
	);
};

export default connect(null, null)(StakingAccountListComponent);
