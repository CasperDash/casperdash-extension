import React from 'react';
import { useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import KeyList from './KeyList';
import { getPublicKey } from '../../selectors/user';
import { keyManagerResult } from '../../selectors/keyManager';

const KeyManager = () => {
	const publicKey = useSelector(getPublicKey);
	const { actionThresholds = {}, associatedKeys = [] } = useSelector(keyManagerResult);

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
										<td></td>
									</tr>
								</tbody>
							</Table>

							{/* <p>
								Public Key: 
							</p>
							<p>
								Account hash: <span>{publicKey}</span>
							</p> */}
							<h3>Action Thresholds</h3>
							<Table className="zl_account_info_table">
								{/* <h3>Account Info</h3> */}
								<tbody>
									<tr>
										<td>Deployment</td>
										<td>
											<span>{actionThresholds.deployment}</span>
										</td>
									</tr>
									<tr>
										<td>Key Management</td>
										<td>{actionThresholds.keyManagement}</td>
									</tr>
								</tbody>
							</Table>
							{/* <p>
								Deployment: <span>{actionThresholds.deployment}</span>
							</p>
							<p>
								Key Management: <span>{actionThresholds.keyManagement}</span>
							</p> */}
						</div>
					</div>
				</div>
				<div className="zl_transaction_list">
					<h3 className="zl_transaction_list_main_heading">Associated Keys</h3>
					<KeyList associatedKeys={associatedKeys} />
				</div>
			</section>
		</>
	);
};

export default KeyManager;
