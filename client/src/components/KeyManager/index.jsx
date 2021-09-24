import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import KeyList from './KeyList';
import { getPublicKey } from '../../selectors/user';
import { keyManagerDetailsSelector, deploySelector, isKeyManagerContractAvailable } from '../../selectors/keyManager';
import { formatKeyByPrefix } from '../../helpers/key';
import { getWeightByAccountHash } from '../../helpers/keyManager';
import { getAccountWeightDeploy, getKeyManagerContractDeploy } from '../../services/keyManager';
import { fetchKeyManagerDetails, putWeightDeploy, deployKeyManagerContract } from '../../actions/keyManagerActions';
import { DeployConfirmModal } from './ConfirmDeployModal';

import { EditModal } from './EditModal';

const KeyManager = () => {
	const publicKey = useSelector(getPublicKey);
	const dispatch = useDispatch();
	//selector value
	const { data: keyManagerData = {} } = useSelector(keyManagerDetailsSelector);
	const isContractAvailable = useSelector(isKeyManagerContractAvailable) && publicKey;
	const { actionThresholds = {}, associatedKeys = [], _accountHash = '' } = keyManagerData || {};
	const accountWeight = getWeightByAccountHash(_accountHash, associatedKeys);

	const [editField, setEditField] = useState('');
	const [editValue, setEditValue] = useState();
	const [showEditModal, setShowEditModal] = useState(false);
	const [deployHash, setDeployHash] = useState();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [confirmMessage, setConfirmMessage] = useState(null);

	const { error: deployError, loading: isDeploying } = useSelector(deploySelector);

	useEffect(() => {
		if (publicKey) {
			dispatch(fetchKeyManagerDetails(publicKey));
		}
	}, [publicKey, dispatch]);

	const onEdit = (field, value) => {
		setEditField(field);
		setEditValue(value);
		setShowEditModal(true);
	};

	const handleCloseEditModal = () => {
		setShowEditModal(false);
	};

	const handleEditValue = (value) => {
		setEditValue(value);
	};

	const handleCloseConfirmModal = () => {
		setShowConfirmModal(false);
	};

	const handleDeployTextClick = () => {
		const confirmMessageContent = (
			<div className="zl_key_manger_contract_confirm_content">
				<p>Deploy keys manager contract *.</p>
				<p className="zl_key_manager_contract_confirm_notice">
					*By confirm this, a keys manager contract will be deploy on your account.
				</p>
				<p className="zl_key_manager_contract_confirm_notice">
					The contract was built based on{' '}
					<a href="https://github.com/casper-ecosystem/keys-manager" target="_blank">
						https://github.com/casper-ecosystem/keys-manager.
					</a>
				</p>
			</div>
		);
		setConfirmMessage(confirmMessageContent);
		setShowConfirmModal(true);
	};

	const handleConfirmDeployContract = async () => {
		const deploy = await getKeyManagerContractDeploy(publicKey);
		const hash = await dispatch(deployKeyManagerContract(deploy));
	};

	const handleSummitChange = async () => {
		let deploy;
		switch (editField) {
			case 'deployment':
				deploy = await getAccountWeightDeploy(editValue, publicKey, publicKey);
				console.log(deploy);
				break;
			case 'weight':
				deploy = await getAccountWeightDeploy(editValue, publicKey, publicKey);
				const { data: hash } = await dispatch(putWeightDeploy(deploy));
				setDeployHash(hash);
				break;
			default:
				break;
		}
	};

	return (
		<>
			<section className="zl_key_manager_page">
				<HeadingModule name={'Key Manager'} />
				<div className="zl_setting_list">
					<div className="zl_setting_list_items">
						<div className="zl_setting_items_heading_peregraph">
							{!isContractAvailable && (
								<div className="zl_error_text">
									Your account haven't deployed keys manager contract yet.{' '}
									<a href="#" onClick={handleDeployTextClick}>
										Click to deploy.
									</a>
								</div>
							)}
							<h3>Account Info</h3>
							<Table className="zl_account_info_table">
								<tbody>
									<tr>
										<td>Public Key</td>
										<td>
											<span>{publicKey}</span>
										</td>
									</tr>
									<tr>
										<td>Account Hash</td>
										<td>{formatKeyByPrefix(_accountHash)}</td>
									</tr>
									<tr>
										<td>Weight</td>
										<td>
											{accountWeight}
											{'   '}
											{accountWeight && isContractAvailable && (
												<i
													className="bi bi-pencil-fill zl_account_info_table_action"
													onClick={() => onEdit('weight', accountWeight)}
												></i>
											)}
										</td>
									</tr>
								</tbody>
							</Table>
						</div>
					</div>
					<div className="zl_setting_list_items">
						<div className="zl_setting_items_heading_peregraph">
							<h3>Action Thresholds</h3>
							<Table className="zl_account_info_table">
								<tbody>
									<tr>
										<td>Deployment</td>
										<td>
											{actionThresholds.deployment}
											{'   '}
											{actionThresholds.deployment && isContractAvailable && (
												<i
													className="bi bi-pencil-fill zl_account_info_table_action"
													onClick={() => onEdit('deployment', actionThresholds.deployment)}
												></i>
											)}
										</td>
									</tr>
									<tr>
										<td>Key Management</td>
										<td>
											{actionThresholds.keyManagement}
											{'   '}
											{actionThresholds.keyManagement && isContractAvailable && (
												<i className="bi bi-pencil-fill zl_account_info_table_action"></i>
											)}
										</td>
										<td></td>
									</tr>
								</tbody>
							</Table>
						</div>
					</div>
				</div>
				<div className="zl_transaction_list">
					<div>
						<div className="zl_transaction_list_main_heading">
							Associated Keys
							<div className="zl_transaction_list_main_heading_action">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									class="bi bi-plus-circle"
									viewBox="0 0 16 16"
								>
									<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
									<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
								</svg>
							</div>
						</div>
					</div>
					<KeyList associatedKeys={associatedKeys} />
				</div>
			</section>
			<EditModal
				field={editField}
				value={editValue}
				show={showEditModal}
				handleClose={handleCloseEditModal}
				handleEditValue={handleEditValue}
				handleSummitChange={handleSummitChange}
			/>
			<DeployConfirmModal
				show={showConfirmModal}
				handleClose={handleCloseConfirmModal}
				message={confirmMessage}
				onDeploy={handleConfirmDeployContract}
			/>
		</>
	);
};

export default KeyManager;
