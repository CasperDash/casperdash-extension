import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import AllTransactionList from '../Common/Layout/TransactionList/AllTransactionList';
import { SendReceiveSection } from '../Common/SendReceive';
import { getMassagedUserDetails, getPublicKey } from '../../selectors/user';
import { getPriceHistory, getCurrentPrice } from '../../selectors/price';
import { formatKeyByPrefix } from '../../helpers/key';
import { MessageModal } from '../Common/Layout/Modal/MessageModal';
import { ChartLine } from '../Common/Layout/Chart';
import { toFormattedNumber, toFormattedCurrency } from '../../helpers/format';
import { useDeploysWithStatus } from '../hooks/useTransferDeploys';

const Stacking = () => {
	// Selector
	const transfersDeployList = [
		{
			validator: '0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca',
			fee: '5%',
			total: '123,000 CSPR',
		},
		{
			validator: '0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca',
			fee: '5%',
			total: '123,000 CSPR',
		},
		{
			validator: '0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca',
			fee: '5%',
			total: '123,000 CSPR',
		},
		{
			validator: '0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca',
			fee: '5%',
			total: '123,000 CSPR',
		},
	];
	const userDetails = useSelector(getMassagedUserDetails);
	const publicKey = useSelector(getPublicKey);
	return (
		<>
			<section className="cd_wallets_page">
				<HeadingModule name={'NFTs'} />
				<div className="cd_setting_list">
					<div className="cd_setting_list_items">
						<div className="cd_setting_items_heading_peregraph">
							<h3>Account Info</h3>
							<Table className="cd_account_info_table">
								<tbody>
									<tr>
										<td>Public Key</td>
										<td>
											<span>{publicKey}</span>
										</td>
									</tr>
									<tr>
										<td>Account Hash</td>
										<td>{formatKeyByPrefix(userDetails._accountHash)}</td>
									</tr>
								</tbody>
							</Table>
						</div>
					</div>
					<div className="overflow-auto">
						<Table className="cd_transaction_list_table">
							<thead>
								<tr>
									<th className="cd_transaction_list_table_heading">validator</th>
									<th className="cd_transaction_list_table_heading">fee</th>
									<th className="cd_transaction_list_table_heading">total stack</th>
									<th className="cd_transaction_list_table_heading">stack</th>
								</tr>
							</thead>
							<tbody>
								{transfersDeployList.map((transfer, i) => (
									<tr key={transfer.deployHash}>
										<td className="cd_transaction_list_name">{transfer.validator}</td>
										<td className="cd_transaction_list_type">{transfer.fee}</td>
										<td className="cd_transaction_list_id">{transfer.total}</td>
										<td className="cd_transaction_list_id">
											<Button>Delegate</Button>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
				</div>
			</section>
		</>
	);
};

export default Stacking;
