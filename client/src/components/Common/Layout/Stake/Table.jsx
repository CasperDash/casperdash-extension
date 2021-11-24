import React from 'react';
import { connect } from 'react-redux';
import { Table, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { toFormattedNumber, displayNaN } from '../../../../helpers/format';
import CommonAction from '../../Button/CommonAction';

const EmptyDelegation = () => (
	<div className="cd_empty_delegation_row row">
		<div className="cd_empty_delegation_section position-relative">
			<img src="assets/image/no-staking-icon.svg" alt="empty-cspr-stake" />
			<div className="cd_empty_delegation_message">
				You do not have any delegations yet. Stake CSPR, earn rewards and help Capser become more secure!
			</div>
		</div>
	</div>
);

const TableActions = ({ validator, delegateFunc, unDelegateFunc }) => {
	return (
		<>
			<OverlayTrigger placement="top" overlay={<Tooltip>Undelegate</Tooltip>}>
				<i className="bi bi-x-square" onClick={() => unDelegateFunc(validator)} />
			</OverlayTrigger>
		</>
	);
};

const StakingAccountListComponent = ({ stakingDeployList = [], delegateFunc, unDelegateFunc }) => {
	if (!stakingDeployList.length) {
		return <EmptyDelegation />;
	}
	const total = stakingDeployList
		.filter((stake) => !!stake.stakedAmount)
		.map((stake) => stake.stakedAmount)
		.reduce((prev, next) => prev + next, 0);

	return (
		<div className="overflow-auto">
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
									validator={staking.validator}
									delegateFunc={delegateFunc}
									unDelegateFunc={delegateFunc}
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

export default connect(null, null)(StakingAccountListComponent);
