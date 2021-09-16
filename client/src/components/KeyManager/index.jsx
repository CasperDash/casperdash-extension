import React from 'react';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { Tab } from 'react-bootstrap';
import AllList from '../Common/Layout/TransactionList/AllTransactionList';

const KeyManager = () => {
	return (
		<>
			<section className="zl_history_page">
				<HeadingModule name={'Key Manager'} />
				<Tab.Container id="left-tabs-example" defaultActiveKey="tab1">
					<div className="zl_SecureBackup_heading">
						<h3>Account</h3>
					</div>
					<Tab.Content>
						<Tab.Pane eventKey="tab1">
							<AllList value="" />
						</Tab.Pane>
					</Tab.Content>
				</Tab.Container>
			</section>
		</>
	);
};

export default KeyManager;
