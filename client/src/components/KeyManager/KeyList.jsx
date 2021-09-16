import React from 'react';
import { Table } from 'react-bootstrap';

const keyList = new Array(10).fill().map((item, i) => {
	return {
		id: i + 1,
		accountHash: '931df268d9dc4272793a44824a2edfc2ed1737d0d539217b80c6cf43103941f0',
		weight: i + 1,
	};
});

const KeyList = (props) => {
	return (
		<>
			<div className="overflow-auto">
				<Table className="zl_key_list_table">
					<thead>
						<tr>
							<th className="zl_key_list_table_heading">No</th>
							<th className="zl_key_list_table_heading">account hash</th>
							<th className="zl_key_list_table_heading">weight</th>
							<th className="zl_key_list_table_heading">action</th>
						</tr>
					</thead>
					<tbody>
						{keyList.map((key, i) => (
							<tr key={key.id}>
								<td className="zl_key_list_no">{key.id}</td>
								<td className="zl_key_list_key">{key.accountHash}</td>
								<td className="zl_key_list_weight">{key.weight}</td>
								<td className="zl_key_list_action">edit</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
		</>
	);
};

export default KeyList;
