import React from 'react';
import { useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { getMassagedUserDetails, getPublicKey } from '../../selectors/user';
import { formatKeyByPrefix } from '../../helpers/key';

const NFTs = () => {
	const inputField = [
		'dac9b9520fb...cde575407',
		'dac9b9520fb...cde575407',
		'dac9b9520fb...cde575407',
		'dac9b9520fb...cde575407',
		'dac9b9520fb...cde575407',
		'dac9b9520fb...cde575407',
		'dac9b9520fb...cde575407',
		'dac9b9520fb...cde575407',
		'dac9b9520fb...cde575407',
		'dac9b9520fb...cde575407',
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
						{inputField.map((inputValue) => (
							<div className="cd_securebackup_col_3 col-lg-3 col-md-6" key={inputValue}>
								<div className="cd_securebackup_input_content position-relative">
									<p className="cd_securebackup_input_text">{inputValue}</p>
									<img style={{ width: 200 }} src={`assets/image/nft6.jpeg`} alt="currency-icon" />
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
