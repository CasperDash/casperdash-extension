import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { Tab, Nav } from 'react-bootstrap';
import { getMassagedUserDetails } from '../../selectors/user';
import AllList from '../Common/Layout/TransactionList/AllTransactionList';
import { getCurrentPrice } from '../../selectors/price';
import { toFormattedNumber } from '../../helpers/format';
import { getTransfersFromLocalStorage } from '../../actions/deployActions';
import { getTransfersDeploy } from '../../selectors/deploy';
import { getPublicKey } from '../../selectors/user';

const PortfolioModule = () => {
	const dispatch = useDispatch();
	const userDetails = useSelector(getMassagedUserDetails);
	const currentPrice = useSelector(getCurrentPrice);
	const publicKey = useSelector(getPublicKey);
	const transferList = useSelector(getTransfersDeploy());

	useEffect(() => {
		dispatch(getTransfersFromLocalStorage(publicKey));
	}, [dispatch, publicKey]);

	const displayBalance = userDetails && userDetails.balance ? userDetails.balance.displayBalance : 0;
	return (
		<>
			<section className="cd_history_page">
				<HeadingModule name={'History'} />
				<Tab.Container id="left-tabs-example" defaultActiveKey="tab1">
					<div className="cd_add_token_content">
						<h3 className="cd_bottom_content_heading">Activities</h3>
						<Nav className="cd_add_token_row row">
							<Nav.Item className="cd_add_token_column col">
								<Nav.Link
									eventKey="tab1"
									className="cd_add_token_inner_content cd_add_ethereum_currency"
								>
									<div className="cd_add_token_icon_chart">
										<div className="cd_currency_icon">
											<img
												src="assets/image/cspr.png"
												alt="currency-icon"
												className="cd_currency_img"
											/>
										</div>
									</div>
									<div className="cd_add_token_price">
										<div className="cd_add_token_left_price">
											<h3>CSPR</h3>
											<p>{toFormattedNumber(displayBalance)}</p>
										</div>
										<div className="cd_add_token_right_price">
											<p>
												{toFormattedNumber(displayBalance * currentPrice, undefined, {
													style: 'currency',
													currency: 'USD',
												})}
											</p>
										</div>
									</div>
								</Nav.Link>
							</Nav.Item>
						</Nav>
					</div>
					<Tab.Content>
						<Tab.Pane eventKey="tab1">
							<AllList transfersDeployList={transferList} />
						</Tab.Pane>
					</Tab.Content>
				</Tab.Container>
			</section>
		</>
	);
};

export default PortfolioModule;
