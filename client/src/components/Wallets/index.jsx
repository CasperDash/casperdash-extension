import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { Tab } from 'react-bootstrap';
import WalletDetails from '../Common/Layout/WalletComponent/main';
import { getBalance } from '../../actions/userActions';

const currency = [
	{
		id: 1,
		name: 'CSPR',
		ratio: '1.9678',
		updown: '+12,5%',
		price: '$6,541.1',
		value: 'cspr',
	},
];
const PortfolioModule = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getBalance());
	});
	return (
		<>
			<section className="zl_wallets_page">
				<HeadingModule name={'Dashboard'} />
				<Tab.Container id="left-tabs-example" defaultActiveKey="tab1">
					<Tab.Content>
						{currency.map((item) => (
							<Tab.Pane eventKey={`tab${item.id}`} key={item.id}>
								<WalletDetails {...item} />
							</Tab.Pane>
						))}
					</Tab.Content>
				</Tab.Container>
			</section>
		</>
	);
};

export default connect(null, null)(PortfolioModule);
