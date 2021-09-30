import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';

const transactionList = new Array(10).fill().map((item, i) => {
	return {
		id: i + 1,
		transactionType: 'assets/image/cspr.png',
		transactionName: 'CSPR',
		transactionId: '5bfa9573d7bc89742a4b8ec5f1da0ed09475bfa9573d7bc8',
		transactionValue: '+0.025',
		transactionValueUpDown: 'cd_transaction_pluse',
		transactionStatus: 'Completed',
		transactionStatusUpDown: 'cd_transaction_completed',
		transactionDate: '08/26/2018',
	};
});

const AllTransactionListComponent = (props) => {
	// Transaction list
	const [transaction, setTransaction] = useState(transactionList);
	useEffect(() => {
		const regex = new RegExp(props.value, 'i');
		const filtered = transactionList.filter((item) => {
			return item['transactionName'].search(regex) > -1;
		});
		setTransaction(filtered);
	}, [props]);

	return (
		<>
			<div className="overflow-auto">
				<Table className="cd_transaction_list_table">
					<thead>
						<tr>
							<th className="cd_transaction_list_table_heading">type</th>
							<th className="cd_transaction_list_table_heading">name</th>
							<th className="cd_transaction_list_table_heading">transaction id</th>
							<th className="cd_transaction_list_table_heading">value</th>
							<th className="cd_transaction_list_table_heading">status</th>
							<th className="cd_transaction_list_table_heading">date</th>
						</tr>
					</thead>
					<tbody>
						{transaction.map((transactionListData, i) => (
							<tr key={transactionListData.id}>
								<td className="cd_transaction_list_type">
									<img src={transactionListData.transactionType} alt="transaction-icon" />
								</td>
								<td className="cd_transaction_list_name">{transactionListData.transactionName}</td>
								<td className="cd_transaction_list_id">{transactionListData.transactionId}</td>
								<td
									className={`${transactionListData.transactionValueUpDown} cd_transaction_list_value`}
								>
									{transactionListData.transactionValue}
								</td>
								<td
									className={`${transactionListData.transactionStatusUpDown} cd_transaction_list_status`}
								>
									{transactionListData.transactionStatus}
								</td>
								<td className="cd_transaction_list_date">{transactionListData.transactionDate}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
		</>
	);
};

export default connect(null, null)(AllTransactionListComponent);
