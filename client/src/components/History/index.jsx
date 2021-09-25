import React from 'react';
import { useSelector } from 'react-redux';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { Tab, Nav } from 'react-bootstrap';
import { getMassagedUserDetails } from '../../selectors/user';
import AllList from '../Common/Layout/TransactionList/AllTransactionList';
import { getCurrentPrice } from '../../selectors/price';

const PortfolioModule = () => {
	const userDetails = useSelector(getMassagedUserDetails);
	const currentPrice = useSelector(getCurrentPrice);

	const displayBalance = userDetails && userDetails.balance ? userDetails.balance.displayBalance : 0;
	return (
		<>
			<section className="zl_history_page">
				<HeadingModule name={'History'} />
				<Tab.Container id="left-tabs-example" defaultActiveKey="tab1">
					<div className="zl_add_currency_content">
						<h3 className="zl_bottom_content_heading">Activities</h3>
						<Nav className="zl_add_currency_row row">
							<Nav.Item className="zl_add_currency_column col">
								<Nav.Link
									eventKey="tab1"
									className="zl_add_currency_inner_content zl_add_ethereum_currency"
								>
									<div className="zl_add_currency_icon_chart">
										<div className="zl_currency_icon">
											<img
												src="assets/image/cspr.png"
												alt="currency-icon"
												className="zl_currency_img"
											/>
										</div>
									</div>
									<div className="zl_add_currency_price">
										<div className="zl_add_currency_left_price">
											<h3>CSPR</h3>
											<p>{displayBalance}</p>
										</div>
										<div className="zl_add_currency_right_price">
											<p>${displayBalance * currentPrice}</p>
										</div>
									</div>
								</Nav.Link>
							</Nav.Item>
						</Nav>
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

export default PortfolioModule;
