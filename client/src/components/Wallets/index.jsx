import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import WalletDetails from './WalletDetails';
import { getBalance } from '../../actions/userActions';

const currency = {
	id: 1,
	name: 'CSPR',
	ratio: '1.9678',
	updown: '+12,5%',
	price: '$6,541.1',
	value: 'cspr',
};

const PortfolioModule = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getBalance());
	});
	return (
		<>
			<section className="zl_wallets_page">
				<HeadingModule name={'Dashboard'} />
				<WalletDetails {...currency} />
			</section>
		</>
	);
};

export default PortfolioModule;
