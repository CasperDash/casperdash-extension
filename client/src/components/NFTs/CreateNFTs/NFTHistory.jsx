import React from 'react';
import { Table } from 'react-bootstrap';
import { toFormattedDate } from '../../../helpers/format';
import CommonAction from '../../Common/Button/CommonAction';
import { MiddleTruncatedText } from '../../Common/MiddleTruncatedText';

export const NFTHistory = ({ nftDeployHistory = [] }) => {
	return (
		<>
			<div className="cd_table_wrapper">
				<Table className="cd_transaction_list_table" responsive="sm">
					<thead>
						<tr>
							<th className="cd_transaction_list_table_heading">type</th>
							<th className="cd_transaction_list_table_heading">collection</th>
							<th className="cd_transaction_list_table_heading">deploy hash</th>
							<th className="cd_transaction_list_table_heading">Recipient</th>
							<th className="cd_transaction_list_table_heading">status</th>
							<th className="cd_transaction_list_table_heading">date</th>
						</tr>
					</thead>
					<tbody>
						{nftDeployHistory.map((deploy) => (
							<tr key={deploy.hash}>
								<td className="cd_transaction_list_type">{deploy.type}</td>
								<td className="cd_transaction_list_type">{deploy.name || deploy.collectionName}</td>
								<td className="cd_transaction_list_id">
									<MiddleTruncatedText>{deploy.hash}</MiddleTruncatedText>{' '}
									<CommonAction type="deploy" value={deploy.hash} />
								</td>
								<td className="cd_transaction_list_id">
									<MiddleTruncatedText>{deploy.hash}</MiddleTruncatedText>
									<CommonAction type="deploy" value={deploy.hash} />
								</td>
								<td
									className={`cd_transaction_${
										deploy.status || 'pending'
									} cd_transaction_list_status`}
								>
									{deploy.status || 'pending'}
								</td>
								<td className="cd_transaction_list_date">{toFormattedDate(deploy.timestamp)}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
		</>
	);
};
