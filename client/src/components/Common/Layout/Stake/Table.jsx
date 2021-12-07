import React from 'react';
import { Table } from 'react-bootstrap';
import { toFormattedNumber, displayNaN } from '../../../../helpers/format';
import CommonAction from '../../Button/CommonAction';
import EmptyDelegation from './EmptyDelegation';
import TableActions from './TableActions';

const StakingAccountListComponent = ({
	stakingDeployList = [],
	unDelegateFunc,
	isLoading = false,
	isConfirmingTrans,
}) => {
	if (!stakingDeployList.length) {
		return <EmptyDelegation isLoading={isLoading} />;
	}

	const total = stakingDeployList
		.filter((stake) => !!stake.stakedAmount)
		.map((stake) => stake.stakedAmount)
		.reduce((prev, next) => prev + next, 0);

	return (
		<div className="cd_table_wrapper">
			<Table className="cd_transaction_list_table cd_stake_table">
				<thead>
					<tr>
						<th className="cd_transaction_list_table_heading">No</th>
						<th className="cd_transaction_list_table_heading">Validator</th>
						<th className="cd_transaction_list_table_heading">Pending Amount</th>
						<th className="cd_transaction_list_table_heading">Staked Amount</th>
						<th className="cd_transaction_list_table_heading">Actions</th>
					</tr>
				</thead>
				<tbody>
					{stakingDeployList.map((staking, i) => (
						<tr key={staking.validator}>
							<td className="cd_transaction_list_no">{i + 1}</td>
							<td className="cd_transaction_list_validator">
								{staking.validator} <CommonAction type="account" value={staking.validator} />
							</td>
							<td className="cd_transaction_list_amount">
								{displayNaN(toFormattedNumber(staking.pendingAmount))}
							</td>
							<td className="cd_transaction_list_amount">
								{displayNaN(toFormattedNumber(staking.stakedAmount))}
							</td>
							<td className="cd_stake_table_actions">
								<TableActions
									validator={staking}
									unDelegateFunc={unDelegateFunc}
									disableAction={isConfirmingTrans}
								/>
							</td>
						</tr>
					))}
					<tr>
						<td colSpan="1">
							<b>Total</b>
						</td>
						<td colSpan="2" />
						<td colSpan="1">
							<span>
								<b>{toFormattedNumber(total)}</b>
							</span>
						</td>
					</tr>
				</tbody>
			</Table>
		</div>
	);
};

export default StakingAccountListComponent;
