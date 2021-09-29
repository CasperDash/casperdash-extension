import React from 'react';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import { Link } from 'react-router-dom';
import { Tab, Nav } from 'react-bootstrap';
//import WalletDetails from '../components/Layout/WalletComponent/main';

const cuurency = [
	{
		id: 1,
		name: 'BTC',
		ratio: '1.9678',
		updown: '+12,5%',
		price: '$6,541.1',
		class: 'cd_add_bitcoin_currency',
		value: 'Bitcoin',
	},
	{
		id: 2,
		name: 'ETH',
		ratio: '3.2134',
		updown: '-5.23%',
		price: '$3,452.1',
		class: 'cd_add_ethereum_currency',
		value: 'Ethereum',
	},
	{
		id: 3,
		name: 'DASH',
		ratio: '38.234',
		updown: '+39.69%',
		price: '$346.31',
		class: 'cd_add_litecoin_currency',
		value: 'Dash Parr',
	},
];
const Tokens = () => {
	return (
		<>
			<section className="cd_wallets_page">
				<HeadingModule name={'Tokens'} />
				<Tab.Container id="left-tabs-example" defaultActiveKey="tab1">
					<div className="cd_add_token_content">
						<Nav className="cd_add_token_row row">
							<div className="cd_currency_column_sub_row">
								<Nav.Item className="cd_add_token_column col">
									<Nav.Link
										eventKey="tab1"
										className="cd_add_token_inner_content cd_add_bitcoin_currency"
									>
										<div className="cd_add_token_icon_chart">
											<div className="cd_currency_icon">
												<svg viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
													<g>
														<path
															fillRule="evenodd"
															clipRule="evenodd"
															d="M13.96 9.45191L13.9783 13.2264H19.3666C20.3236 13.2264 21.0992 12.4443 21.0944 11.4825L21.093 11.1958C21.0884 10.2338 20.3053 9.45191 19.3482 9.45191H14.6976H13.96ZM21.7786 18.9638L21.7771 18.6608C21.772 17.5879 20.8995 16.7168 19.8322 16.7168H19.3838H13.9955L14.0159 20.9079H19.8524C20.9198 20.9079 21.7838 20.0353 21.7786 18.9638ZM23.4886 14.6793C24.5609 15.6723 25.2408 17.0875 25.2484 18.6608L25.2499 18.9638C25.2645 21.9591 22.8506 24.3969 19.8692 24.3969H19.7373L19.7449 26H16.2735L16.2657 24.3969H14.8429L14.8507 26H11.3793L11.3715 24.3969H10.5611H8.83951L8.82256 20.9079H10.5442L10.5239 16.7168L10.5068 13.2264L10.4886 9.45189H8.76694L8.75 5.9616H11.282L11.2725 4H14.7439L14.7534 5.9616H16.1763L16.1667 4H19.6383L19.6478 5.97803C22.3731 6.14423 24.5513 8.41715 24.5648 11.1958L24.5661 11.4825C24.572 12.6866 24.1667 13.7932 23.4886 14.6793Z"
															fill="url(#paint0_linear)"
														/>
														<path
															fillRule="evenodd"
															clipRule="evenodd"
															d="M13.96 9.45191L13.9783 13.2264H19.3666C20.3236 13.2264 21.0992 12.4443 21.0944 11.4825L21.093 11.1958C21.0884 10.2338 20.3053 9.45191 19.3482 9.45191H14.6976H13.96ZM21.7786 18.9638L21.7771 18.6608C21.772 17.5879 20.8995 16.7168 19.8322 16.7168H19.3838H13.9955L14.0159 20.9079H19.8524C20.9198 20.9079 21.7838 20.0353 21.7786 18.9638ZM23.4886 14.6793C24.5609 15.6723 25.2408 17.0875 25.2484 18.6608L25.2499 18.9638C25.2645 21.9591 22.8506 24.3969 19.8692 24.3969H19.7373L19.7449 26H16.2735L16.2657 24.3969H14.8429L14.8507 26H11.3793L11.3715 24.3969H10.5611H8.83951L8.82256 20.9079H10.5442L10.5239 16.7168L10.5068 13.2264L10.4886 9.45189H8.76694L8.75 5.9616H11.282L11.2725 4H14.7439L14.7534 5.9616H16.1763L16.1667 4H19.6383L19.6478 5.97803C22.3731 6.14423 24.5513 8.41715 24.5648 11.1958L24.5661 11.4825C24.572 12.6866 24.1667 13.7932 23.4886 14.6793Z"
															fill="#7781A2"
														/>
													</g>
												</svg>
											</div>
										</div>
										<div className="cd_add_token_price">
											<div className="cd_add_token_left_price">
												<h3>BTC</h3>
												<p>1.9678</p>
											</div>
											<div className="cd_add_token_right_price">
												<span>
													<svg
														width="6"
														height="6"
														viewBox="0 0 6 6"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z"
															fill="#50E2C2"
														/>
													</svg>
													+12,5%
												</span>
												<p>$6,541.1</p>
											</div>
										</div>
									</Nav.Link>
								</Nav.Item>
								<Nav.Item className="cd_add_token_column col">
									<Nav.Link
										eventKey="tab2"
										className="cd_add_token_inner_content cd_add_ethereum_currency"
									>
										<div className="cd_add_token_icon_chart">
											<div className="cd_currency_icon">
												<svg viewBox="0 0 17 26" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M8.48909 9.60596L0 13.2332L8.48909 17.9453L16.9748 13.2332L8.48909 9.60596Z"
														fill="#010101"
														fillOpacity="0.6"
													/>
													<path
														className="left-shap"
														fillRule="evenodd"
														clipRule="evenodd"
														d="M0 13.2332L8.48909 17.9452V0L0 13.2332Z"
														fill="#96A0C2"
													/>
													<path
														className="right-shap"
														fillRule="evenodd"
														clipRule="evenodd"
														d="M8.48926 0V17.9452L16.975 13.2332L8.48926 0Z"
														fill="#7680A0"
													/>
													<path
														className="left-shap"
														fillRule="evenodd"
														clipRule="evenodd"
														d="M0 14.7444L8.48909 25.9805V19.4564L0 14.7444Z"
														fill="#96A0C2"
													/>
													<path
														className="right-shap"
														fillRule="evenodd"
														clipRule="evenodd"
														d="M8.48926 19.4564V25.9805L16.9817 14.7444L8.48926 19.4564Z"
														fill="#7680A0"
													/>
												</svg>
											</div>
										</div>
										<div className="cd_add_token_price">
											<div className="cd_add_token_left_price">
												<h3>ETH</h3>
												<p>3.2134</p>
											</div>
											<div className="cd_add_token_right_price">
												<span className="cd_add_token_down_price">
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
								<Nav.Item className="cd_add_token_column col">
									<Nav.Link
										eventKey="tab3"
										className="cd_add_token_inner_content cd_add_litecoin_currency"
									>
										<div className="cd_add_token_icon_chart">
											<div className="cd_currency_icon">
												<svg
													width="16"
													height="22"
													viewBox="0 0 28 22"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M17.7513 0H7.88132L7.06403 4.57013L15.9708 4.58264C20.3574 4.58264 21.6543 6.17551 21.6167 8.81501C21.5959 10.1702 21.0121 12.4594 20.7577 13.2017C20.0822 15.1782 18.6937 17.4382 13.4897 17.4299L4.83317 17.4257L4.01172 22H13.8567C17.3301 22 18.8063 21.5955 20.3699 20.8741C23.8392 19.2729 25.9033 15.8495 26.7289 11.3836C27.959 4.73275 26.4245 0 17.7513 0"
														fill="#7781A2"
													/>
													<path
														d="M3.62358 8.7066C1.03829 8.7066 0.667172 10.3912 0.425322 11.4087C0.104246 12.743 0 13.2809 0 13.2809H10.1035C12.6888 13.2809 13.0599 11.5963 13.3017 10.5789C13.6228 9.24451 13.7271 8.7066 13.7271 8.7066H3.62358Z"
														fill="#7781A2"
													/>
												</svg>
											</div>
										</div>
										<div className="cd_add_token_price">
											<div className="cd_add_token_left_price">
												<h3>DASH</h3>
												<p>38.234</p>
											</div>
											<div className="cd_add_token_right_price">
												<span>
													<svg
														width="6"
														height="6"
														viewBox="0 0 6 6"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z"
															fill="#50E2C2"
														/>
													</svg>
													+39.69%
												</span>
												<p>$346.31</p>
											</div>
										</div>
									</Nav.Link>
								</Nav.Item>
							</div>
							<div className="cd_add_token_column cd_add_token_btn_col col">
								<div className="cd_add_token_btn_content">+ Add Token</div>
							</div>
						</Nav>
					</div>
					<Tab.Content>
						{/* {cuurency.map((item) => (
                        <Tab.Pane eventKey={`tab${item.id}`}  key={item.id}>
                            <WalletDetails {...item} />
                        </Tab.Pane>
                        ))} */}
						{/* <Tab.Pane eventKey="tab1">
                            <MainComponent />
                        </Tab.Pane>
                        <Tab.Pane eventKey="tab2">
                            <EthereumComponent />
                        </Tab.Pane>
                        <Tab.Pane eventKey="tab3">
                            <LitecoinComponent />
                        </Tab.Pane> */}
					</Tab.Content>
				</Tab.Container>
			</section>
		</>
	);
};

export default Tokens;
