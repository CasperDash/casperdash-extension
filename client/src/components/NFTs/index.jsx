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
const NFTs = () => {
	const inputField = [
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
		'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407',
	];
	// Selector
	const userDetails = useSelector(getMassagedUserDetails);
	const publicKey = useSelector(getPublicKey);

	return (
		<>
			<section className="cd_wallets_page">
				<HeadingModule name={'NFTs'} />
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
					<div className="cd_securebackup_row row">
						{inputField.map((inputValue, i) => (
							<div className="cd_securebackup_col_3 col-lg-3 col-md-6" key={inputValue}>
								<div className="cd_securebackup_input_content position-relative">
									<p className="cd_securebackup_input_text">{inputValue}</p>
									<img style={{ width: 300 }} src={`assets/image/nft6.jpeg`} alt="currency-icon" />
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default NFTs;
