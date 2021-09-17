import React from 'react';
import { Table } from 'react-bootstrap';
import { formatKeyByPrefix } from '../../helpers/key';

const KeyList = ({ associatedKeys }) => {
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
						{associatedKeys.map((key, i) => (
							<tr key={i}>
								<td className="zl_key_list_no">{i + 1}</td>
								<td className="zl_key_list_key">{formatKeyByPrefix(key.accountHash)}</td>
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
