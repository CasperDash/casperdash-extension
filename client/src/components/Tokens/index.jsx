import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAutoRefreshEffect } from '../hooks/useAutoRefreshEffect';
import HeadingModule from '../Common/Layout/HeadingComponent/Heading';
import { Tab } from 'react-bootstrap';
import { SendReceiveSection } from '../Common/SendReceive';
import { getMassagedUserDetails, getPublicKey } from '../../selectors/user';
import { fetchTokensInfo } from '../../actions/tokensActions';
import { getMassagedTokenData } from '../../selectors/tokens';
import { useEffect } from 'react';

const TOKENS = [
	{
		symbol: 'CDAS',
		name: 'Casper Dash',
		address: 'dac9b9520fbb96d2c50dca5cd99113d19f096cde575407c1b8a457e544338064',
	},
];
const Tokens = () => {
	const dispatch = useDispatch();
	const tokensInfo = useSelector(getMassagedTokenData);
	const [selectedToken, setSelectedToken] = useState({});
	const userDetails = useSelector(getMassagedUserDetails);
	const publicKey = useSelector(getPublicKey);

	useEffect(() => {
		if (tokensInfo.length) {
			const tokenInfo = tokensInfo.find((token) => token.address === selectedToken.address) || tokensInfo[0];
			setSelectedToken(tokenInfo);
		}
	}, [tokensInfo]);

	useAutoRefreshEffect(() => {
		dispatch(
			fetchTokensInfo(
				TOKENS.map((token) => token.address).filter((addr) => addr),
				publicKey,
			),
		);
	}, [publicKey]);

	const onTokenClick = (address) => {
		setSelectedToken(tokensInfo.find((token) => token.address === address));
	};

	return (
		<>
			<section className="cd_wallets_page">
				<HeadingModule name={'Tokens'} />
				<Tab.Container id="left-tabs-example" defaultActiveKey="tab1">
					<div className="cd_add_token_content cd_add_token_row row">
						<div className="cd_currency_column_sub_row">
							{tokensInfo.map(({ symbol, address, balance }) => {
								const isSelected = selectedToken.address === address;
								return (
									<div
										className="cd_add_token_column col"
										key={address}
										onClick={() => onTokenClick(address)}
									>
										<div
											className={`cd_add_token_inner_content cd_add_litecoin_currency ${
												isSelected ? 'active' : ''
											}`}
										>
											<div className="cd_add_token_price">
												<div className="cd_add_token_left_price">
													<h3>{symbol}</h3>
													<p>{balance && balance.displayValue}</p>
												</div>
												<div className="cd_add_token_right_price">
													<p>$--</p>
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
							fromAddress={publicKey}
							displayBalance={selectedToken.balance && selectedToken.balance.displayValue}
							minAmount={0}
						/>
					</Tab.Content>
				</Tab.Container>
			</section>
		</>
	);
};

export default Tokens;
