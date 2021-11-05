import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import AllTransactionList from '../Common/Layout/TransactionList/AllTransactionList';
import { SendReceiveSection } from '../Common/SendReceive';
import { getMassagedUserDetails, getPublicKey } from '../../selectors/user';
import { getPriceHistory, getCurrentPrice } from '../../selectors/price';
import { formatKeyByPrefix } from '../../helpers/key';
import { MessageModal } from '../Common/Layout/Modal/MessageModal';
import { ChartLine } from '../Common/Layout/Chart';
import { toFormattedNumber, toFormattedCurrency } from '../../helpers/format';
import { useDeploysWithStatus } from '../hooks/useTransferDeploys';

const WalletDetails = () => {
	// State
	const [send, setSend] = useState(false);
	const [showError, setShowError] = useState(false);

	// Selector
	const userDetails = useSelector(getMassagedUserDetails);
	const publicKey = useSelector(getPublicKey);
	const priceHistory = useSelector(getPriceHistory);
	const currentPrice = useSelector(getCurrentPrice);
	const transfersDeployList = useDeploysWithStatus({ symbol: 'CSPR', publicKey });

	// Function
	const handleToggle = () => {
		if (publicKey) {
			setSend(!send);
		} else {
			setShowError(true);
		}
	};

	const displayBalance = userDetails && userDetails.balance ? userDetails.balance.displayBalance : 0;

	return (
		<>
			<section className="cd_wallets_page">
				<HeadingModule name={'Dashboard'} />
				<div className="cd_setting_list">
					<div className="cd_setting_list_items">
						<div className="cd_setting_items_heading_peregraph">
							<h3>Account Info</h3>
							<Table className="cd_account_info_table">
								<tbody>
									<tr>
										<td>Public Key</td>
										<td>
											<span>{publicKey}</span>
										</td>
									</tr>
									<tr>
										<td>Account Hash</td>
										<td>{formatKeyByPrefix(userDetails._accountHash)}</td>
									</tr>
								</tbody>
							</Table>
						</div>
					</div>
				</div>
				<div className={`cd_chart_component ${send ? 'active' : ''}`}>
					<div className="cd_all_page_comman_content">
						<div className="cd_dashboard_chart">
							<ChartLine data={priceHistory} />
						</div>
						<div className="cd_chart_box_heading_date">
							<h2 className="cd_chart_box_heading">
								<div className="cd_add_token_icon_chart">
									<img src="assets/image/cspr.png" alt="currency-icon" />
								</div>
								<div>CSPR</div>
								<div className="cd_current_price">${currentPrice}</div>
							</h2>
						</div>

						<div className="cd_wallet_chart_bottom_content">
							<div className="cd_all_page_comman_total_price">
								<p className="cd_all_page_total_price_heading">Total Balance</p>
								<h2 className="cd_all_page_total_price_text">
									{toFormattedNumber(displayBalance)}{' '}
									<span className="cd_all_page_total_price_value">
										({toFormattedCurrency(displayBalance * currentPrice)})
									</span>
								</h2>
							</div>
							<div className="cd_wallet_chart_send_receive_btn">
								<Button className="cd_wallet_chart_send_btn" onClick={handleToggle}>
									<svg
										width="15"
										height="15"
										viewBox="0 0 6 6"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z"
											fill="#252F47"
										/>
									</svg>
									Send
								</Button>
								<Button className="cd_wallet_chart_receive_btn" onClick={handleToggle}>
									<svg
										width="15"
										height="15"
										viewBox="0 0 6 6"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z"
											fill="#252F47"
										/>
									</svg>
									Receive
								</Button>
							</div>
						</div>
					</div>
					<SendReceiveSection
						handleToggle={handleToggle}
						displayBalance={displayBalance}
						fromAddress={publicKey}
						csprPrice={currentPrice}
					/>
					<div className="cd_transaction_list">
						<h3 className="cd_transaction_list_main_heading">
							Transaction
							<Link to={'/history'}>See All</Link>
						</h3>
						<AllTransactionList value="cspr" transfersDeployList={transfersDeployList} />
					</div>
				</div>
				<MessageModal
					type="Error"
					message="Unlock your Signer!"
					show={showError}
					handleClose={() => setShowError(false)}
				/>
			</section>
		</>
	);
};

export default WalletDetails;
