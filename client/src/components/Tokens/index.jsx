import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { Tab, Nav } from 'react-bootstrap';
import { SendReceiveSection } from '../Wallets/SendReceiveSection';
import { getMassagedUserDetails, getPublicKey } from '../../selectors/user';
//import WalletDetails from '../components/Layout/WalletComponent/main';

const TOKENS = [
	{
		id: 1,
		symbol: 'BTC',
		name: 'Bitcoin',
		contractAddress: 'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407c1b8a457e544338064',
	},
	{
		id: 2,
		symbol: 'ETH',
		name: 'Ethereum',
	},
	{
		id: 3,
		symbol: 'DASH',
		name: 'Casper Dash',
	},
];
const Tokens = () => {
	const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
	const userDetails = useSelector(getMassagedUserDetails);
	const publicKey = useSelector(getPublicKey);

	const onTokenClick = (tokenName) => {
		setSelectedToken(TOKENS.find((token) => token.name === tokenName));
	};
	return (
		<>
			<section className="cd_wallets_page">
				<HeadingModule name={'Tokens'} />
				<Tab.Container id="left-tabs-example" defaultActiveKey="tab1">
					<div className="cd_add_token_content cd_add_token_row row">
						<div className="cd_currency_column_sub_row">
							{TOKENS.map(({ name, symbol }) => {
								const isSelected = selectedToken.name === name;
								return (
									<div
										className="cd_add_token_column col"
										key={name}
										onClick={() => onTokenClick(name)}
									>
										<div
											className={`cd_add_token_inner_content cd_add_litecoin_currency ${
												isSelected ? 'active' : ''
											}`}
										>
											<div className="cd_add_token_price">
												<div className="cd_add_token_left_price">
													<h3>{symbol}</h3>
													<p>3.2134</p>
												</div>
												<div className="cd_add_token_right_price">
													<p>$???</p>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
						<div className="cd_add_token_column cd_add_token_btn_col col">
							<div className="cd_add_token_btn_content">+ Add Token</div>
						</div>
					</div>

					<Tab.Content>
						<SendReceiveSection
							tokenSymbol={selectedToken.symbol}
							displayBalance={10}
							fromAddress={publicKey}
						></SendReceiveSection>
					</Tab.Content>
				</Tab.Container>
			</section>
		</>
	);
};

export default Tokens;
