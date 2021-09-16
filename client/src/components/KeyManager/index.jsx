import React from 'react';
import { useSelector } from 'react-redux';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { Tab } from 'react-bootstrap';
import KeyList from './KeyList';
import { getPublicKey } from '../../selectors/user';

const KeyManager = () => {
	const publicKey = useSelector(getPublicKey);
	return (
		<>
			<section className="zl_key_manager_page">
				<HeadingModule name={'Key Manager'} />
				<div className="zl_setting_list">
					<div className="zl_setting_list_items">
						<div className="zl_setting_items_heading_peregraph">
							<h3>Account Info</h3>
							<p>
								Public Key: <span>{publicKey}</span>
							</p>
							<h4>Action Thresholds</h4>
							<p>
								Deployment: <span>1</span>
							</p>
							<p>
								Key Management: <span>2</span>
							</p>
						</div>
					</div>
				</div>
				<div className="zl_transaction_list">
					<h3 className="zl_transaction_list_main_heading">Associated Keys</h3>
					<KeyList />
				</div>
			</section>
		</>
	);
};

export default KeyManager;
