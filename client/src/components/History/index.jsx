import React from 'react';
import { connect } from 'react-redux';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import { Tab, Nav } from 'react-bootstrap';
import AllList from '../Common/Layout/TransactionList/AllTransactionList';

const PortfolioModule = () => {
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
										<Sparklines
											data={[14, 12, 15, 0, 5, 0]}
											margin={6}
											className="zl_add_currency_mini_chart"
										>
											<SparklinesLine
												style={{
													strokeWidth: 10,
													stroke: '#A330FF',
													fill: 'none',
													curve: 'smooth',
												}}
											/>
											<SparklinesSpots
												size={4}
												style={{ stroke: '#A330FF', strokeWidth: 3, fill: 'white' }}
											/>
										</Sparklines>
									</div>
									<div className="zl_add_currency_price">
										<div className="zl_add_currency_left_price">
											<h3>CSPR</h3>
											<p>3.2134</p>
										</div>
										<div className="zl_add_currency_right_price">
											<span className="zl_add_currency_down_price">
												<svg
													width="6"
													height="6"
													viewBox="0 0 6 6"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M3.60609 2.39391L2.69695 1.48477C2.36222 1.15004 1.81951 1.15004 1.48477 1.48477C1.15004 1.81951 1.15004 2.36222 1.48477 2.69695L2.39391 3.60609L0 6H6V0L3.60609 2.39391Z"
														fill="#E3507A"
													/>
												</svg>
												-5.23%
											</span>
											<p>$3,452.1</p>
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

export default connect(null, null)(PortfolioModule);
