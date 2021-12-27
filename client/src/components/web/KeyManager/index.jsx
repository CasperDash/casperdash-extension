import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import HeadingModule from '../../Common/Layout/HeadingComponent/Heading';
import { useAutoRefreshEffect } from '../../hooks/useAutoRefreshEffect';
import { getPublicKey, getMassagedUserDetails } from '../../../selectors/user';
import {
	isKeyManagerContractAvailable,
	getPendingDeploys,
	getPendingDeployHashes,
} from '../../../selectors/keyManager';
import { formatKeyByPrefix } from '../../../helpers/key';
import { getWeightByAccountHash } from '../../../helpers/keyManager';
import {
	getSignedAccountWeightDeploy,
	getKeyManagerContractDeploy,
	getSignedAccountDeploymentDeploy,
	getSignedKeyManagementThresholdDeploy,
} from '../../../services/keyManager';
import {
	fetchKeyManagerDetails,
	putWeightDeploy,
	deployKeyManagerContract,
	updateKeysManagerLocalStorage,
	getKeysManagerLocalStorage,
	getKeysManagerPendingDeploys,
	updateKeysManagerDeployStatus,
} from '../../../actions/keyManagerActions';
import KeyList from './KeyList';
import { DeployConfirmModal } from './ConfirmDeployModal';
import { AttributeRow } from './AttributeRow';
import { EditModal } from './EditModal';

const KeyManager = () => {
	const dispatch = useDispatch();

	// State
	const [editField, setEditField] = useState('');
	const [editValue, setEditValue] = useState();
	const [showEditModal, setShowEditModal] = useState(false);
	const [deployHash, setDeployHash] = useState();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [confirmMessage, setConfirmMessage] = useState(null);
	const [deployError, setDeployError] = useState('');

	//Selector
	const publicKey = useSelector(getPublicKey);
	const pendingDeploys = useSelector(getPendingDeploys);
	const pendingDeployHashes = useSelector(getPendingDeployHashes);
	const keyManagerData = useSelector(getMassagedUserDetails);
	const isContractAvailable = useSelector(isKeyManagerContractAvailable) && publicKey;
	const { actionThresholds = {}, associatedKeys = [], _accountHash = '' } = keyManagerData || {};
	const accountWeight = getWeightByAccountHash(_accountHash, associatedKeys);

	// Effect
	useEffect(() => {
		if (publicKey) {
			dispatch(fetchKeyManagerDetails(publicKey));
			dispatch(getKeysManagerLocalStorage(publicKey));
		}
	}, [publicKey, dispatch]);

	useAutoRefreshEffect(() => {
		if (pendingDeployHashes.length) {
			(async () => {
				const { data } = await dispatch(getKeysManagerPendingDeploys(pendingDeployHashes));
				dispatch(updateKeysManagerDeployStatus(publicKey, 'keysManager.deploys', data));
			})();
		}
	}, [JSON.stringify(pendingDeployHashes), dispatch]);

	// Function
	const clearState = () => {
		setDeployError('');
		setDeployHash('');
		setEditValue();
		setEditField('');
	};

	const onEdit = (field, value) => {
		setEditField(field);
		setEditValue(value);
		setShowEditModal(true);
	};

	const handleCloseEditModal = () => {
		setShowEditModal(false);
		clearState();
	};

	const onShowDeployHash = (deployHash) => {
		setShowEditModal(true);
		setDeployHash(deployHash);
	};

	const handleEditValue = (value) => {
		setEditValue(value);
	};

	const handleCloseConfirmModal = () => {
		setShowConfirmModal(false);
		clearState();
	};

	const handleDeployTextClick = () => {
		const confirmMessageContent = (
			<div className="cd_key_manger_contract_confirm_content">
				<p>Deploy keys manager contract *.</p>
				<p className="cd_key_manager_contract_confirm_notice">
					*By confirm this, a keys manager contract will be deploy on your account.
				</p>
				<p className="cd_key_manager_contract_confirm_notice">
					The contract was built based on{' '}
					<a
						href="https://github.com/casper-ecosystem/keys-manager"
						target="_blank"
						rel="noopener noreferrer"
					>
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
		if (deploy.error) {
			setDeployError(deploy.error.message);
			return;
		}
		const { data: hash, error } = await dispatch(deployKeyManagerContract(deploy));
		if (!error && hash.deployHash) {
			setDeployHash(hash.deployHash);
			dispatch(
				updateKeysManagerLocalStorage(
					publicKey,
					`keysManager.deploys.installContract`,
					{ hash: hash.deployHash, status: 'pending' },
					'push',
				),
			);
			handleCloseConfirmModal();
		} else {
			setDeployError(error);
		}
	};

	const handleSummitChange = async () => {
		let deploy;
		switch (editField) {
			case 'deployment':
				deploy = await getSignedAccountDeploymentDeploy(editValue, publicKey);
				break;
			case 'weight':
				deploy = await getSignedAccountWeightDeploy(editValue, publicKey, publicKey);
				break;
			case 'keyManagement':
				deploy = await getSignedKeyManagementThresholdDeploy(editValue, publicKey);
				break;
			case 'associatedKey':
				deploy = await getSignedAccountWeightDeploy(1, publicKey, editValue);
				break;
			default:
				deploy = {};
				break;
		}
		if (deploy.error) {
			setDeployError(deploy.error.message);
		} else {
			const { data: hash, error } = await dispatch(putWeightDeploy(deploy));
			if (!error) {
				setDeployHash(hash.deployHash);
				dispatch(
					updateKeysManagerLocalStorage(
						publicKey,
						`keysManager.deploys.${editField}`,
						{ hash: hash.deployHash, status: 'pending' },
						'push',
					),
				);
			} else {
				setDeployError(error);
			}
		}
	};

	return (
		<>
			<section className="cd_key_manager_page">
				<HeadingModule name={'Key Manager'} />
				<div className="cd_setting_list">
					<div className="cd_setting_list_items">
						<div className="cd_setting_items_heading_peregraph">
							{!isContractAvailable && publicKey && (
								<div className="cd_error_text">
									Your account have not deployed keys manager contract yet.{' '}
									{pendingDeploys.installContract && pendingDeploys.installContract.length ? (
										'Installing Contract...'
									) : (
										<a href="#" onClick={handleDeployTextClick}>
											Click to deploy.
										</a>
									)}
								</div>
							)}
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
										<td>{formatKeyByPrefix(_accountHash)}</td>
									</tr>
									<AttributeRow
										valueKey="weight"
										value={accountWeight}
										label="Weight"
										canEdit={isContractAvailable}
										onEdit={onEdit}
										onShowDeployHash={onShowDeployHash}
									/>
								</tbody>
							</Table>
						</div>
					</div>
					<div className="cd_setting_list_items">
						<div className="cd_setting_items_heading_peregraph">
							<h3>Action Thresholds</h3>
							<Table className="cd_account_info_table">
								<tbody>
									<AttributeRow
										valueKey="deployment"
										value={actionThresholds.deployment}
										label="Deployment"
										canEdit={isContractAvailable}
										onEdit={onEdit}
										onShowDeployHash={onShowDeployHash}
									/>
									<AttributeRow
										valueKey="keyManagement"
										value={actionThresholds.keyManagement}
										label="Key Management"
										canEdit={isContractAvailable}
										onEdit={onEdit}
										onShowDeployHash={onShowDeployHash}
									/>
								</tbody>
							</Table>
						</div>
					</div>
				</div>
				<div className="cd_transaction_list">
					<div>
						<div className="cd_transaction_list_main_heading">
							Associated Keys
							{isContractAvailable && (
								<>
									<div className="cd_transaction_list_main_heading_action">
										{pendingDeploys.associatedKey && pendingDeploys.associatedKey.length ? (
											pendingDeploys.associatedKey.map((deploy) => (
												<OverlayTrigger
													placement="top"
													overlay={<Tooltip>{deploy.hash}</Tooltip>}
													key={deploy.hash}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														fill="currentColor"
														className="bi bi-arrow-clockwise"
														viewBox="0 0 16 16"
														onClick={() => onShowDeployHash(deploy.hash)}
													>
														<path
															fillRule="evenodd"
															d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
														/>
														<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
													</svg>
												</OverlayTrigger>
											))
										) : (
											<OverlayTrigger placement="top" overlay={<Tooltip>Add</Tooltip>}>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													fill="currentColor"
													className="bi bi-plus-circle"
													viewBox="0 0 16 16"
													onClick={() => onEdit('associatedKey', '')}
												>
													<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
													<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
												</svg>
											</OverlayTrigger>
										)}
									</div>
								</>
							)}
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
				deployError={deployError}
				deployHash={deployHash}
			/>
			<DeployConfirmModal
				show={showConfirmModal}
				handleClose={handleCloseConfirmModal}
				message={confirmMessage}
				onDeploy={handleConfirmDeployContract}
				error={deployError}
			/>
		</>
	);
};

export default KeyManager;
