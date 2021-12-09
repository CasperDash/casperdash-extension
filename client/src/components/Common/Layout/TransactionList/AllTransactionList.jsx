import React from 'react';
import { Table } from 'react-bootstrap';
import { toFormattedDate } from '../../../../helpers/format';
import CommonAction from '../../Button/CommonAction';

const AllTransactionListComponent = ({ transfersDeployList = [] }) => {
	return (
		<>
			<div className="cd_table_wrapper">
				<Table className="cd_transaction_list_table">
					<thead>
						<tr>
							<th className="cd_transaction_list_table_heading">name</th>
							<th className="cd_transaction_list_table_heading">type</th>
							<th className="cd_transaction_list_table_heading">transaction hash</th>
							<th className="cd_transaction_list_table_heading">transfer id</th>
							<th className="cd_transaction_list_table_heading">value</th>
							<th className="cd_transaction_list_table_heading">status</th>
							<th className="cd_transaction_list_table_heading">date</th>
						</tr>
					</thead>
					<tbody>
						{transfersDeployList.map((transfer) => (
							<tr key={transfer.deployHash}>
								<td className="cd_transaction_list_name">{transfer.symbol}</td>
								<td className="cd_transaction_list_type">Transfer</td>
								<td className="cd_transaction_list_id">
									{transfer.deployHash} <CommonAction type="deploy" value={transfer.deployHash} />
								</td>
								<td className="cd_transaction_list_id">{transfer.transferId}</td>
								<td className={`cd_transaction_minas cd_transaction_list_value`}>-{transfer.amount}</td>
								<td
									className={`cd_transaction_${
										transfer.status || 'pending'
									} cd_transaction_list_status`}
								>
									{transfer.status || 'pending'}
								</td>
								<td className="cd_transaction_list_date">{toFormattedDate(transfer.timestamp)}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
		</>
	);
};

export default AllTransactionListComponent;
