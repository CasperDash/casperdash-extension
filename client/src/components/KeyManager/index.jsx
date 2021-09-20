import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import KeyList from './KeyList';
import { getPublicKey } from '../../selectors/user';
import { keyManagerDetailsSelector } from '../../selectors/keyManager';
import { formatKeyByPrefix } from '../../helpers/key';
import { getWeightByAccountHash } from '../../helpers/keyManager';
import { setKeyWeight } from '../../services/keyManager';
import { fetchKeyManagerDetails } from '../../actions/keyManagerActions';
import { EditModal } from './EditModal';

const KeyManager = () => {
	const publicKey = useSelector(getPublicKey);
	const dispatch = useDispatch();
	const { data: keyManagerData = {} } = useSelector(keyManagerDetailsSelector);
	const { actionThresholds = {}, associatedKeys = [], _accountHash = '' } = keyManagerData || {};
	const accountWeight = getWeightByAccountHash(_accountHash, associatedKeys);
	const [editField, setEditField] = useState('');
	const [editValue, setEditValue] = useState();
	const [showEditModal, setShowEditModal] = useState(false);

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

	const handleSumitChange = async () => {
		let deploy;
		switch (editField) {
			case 'deployment':
				deploy = await setKeyWeight(editValue, publicKey, publicKey);
				console.log(deploy);
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
										<td>{accountWeight}</td>
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
											{actionThresholds.deployment && (
												<i
													className="bi bi-pencil-fill"
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
											{actionThresholds.keyManagement && <i className="bi bi-pencil-fill"></i>}
										</td>
										<td></td>
									</tr>
								</tbody>
							</Table>
						</div>
					</div>
				</div>
				<div className="zl_transaction_list">
					<h3 className="zl_transaction_list_main_heading">Associated Keys</h3>
					<KeyList associatedKeys={associatedKeys} />
				</div>
			</section>
			<EditModal
				field={editField}
				value={editValue}
				show={showEditModal}
				handleClose={handleCloseEditModal}
				handleEditValue={handleEditValue}
				handleSumitChange={handleSumitChange}
			/>
		</>
	);
};

export default KeyManager;
