import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Grid from '../Common/Grid';
import { MiddleTruncatedText } from '../../Common/MiddleTruncatedText';
import { ChartLine } from '../../Common/Layout/Chart';
import { getPriceHistory, getCurrentPrice, CSPRMarketInfoSelector } from '../../../selectors/price';
import { getPublicKey } from '../../../selectors/user';
import { useDeploysWithStatus } from '../../hooks/useTransferDeploys';
import { toFormattedCurrency, toFormattedNumber } from '../../../helpers/format';
import './Market.scss';

const chartOptions = {
	xaxis: {
		labels: {
			style: {
				fontSize: '10px',
			},
		},
	},
	yaxis: {
		labels: {
			style: {
				fontSize: '10px',
			},
		},
		opposite: true,
	},
};

const TRANSFER_METADATA = {
	left: [
		{ key: 'deployHash', type: 'primary', component: MiddleTruncatedText },
		{ key: 'timestamp', type: 'secondary', format: 'date' },
	],
	right: [
		{ key: 'amount', type: 'primary', format: 'number' },
		{ key: 'status', type: 'secondary', valueAsClass: true },
	],
};

const Market = () => {
	// Hook
	const priceHistory = useSelector(getPriceHistory);
	const currentPrice = useSelector(getCurrentPrice);
	const publicKey = useSelector(getPublicKey);
	const { data = [] } = useSelector(CSPRMarketInfoSelector);
	const csprMarketInfo = data && data.length ? data[0] : {};
	const transferList = useDeploysWithStatus({ symbol: 'CSPR', publicKey, status: '' });
	const navigate = useNavigate();

	// Function
	const onTransactionClick = (deploy) => {
		navigate('/deployDetails', { state: { deploy, name: 'Transaction details' } });
	};

	return (
		<section className="cd_we_market with_bottom_bar hide_scroll_bar">
			<div className="cd_we_market_price">
				<div className="cd_we_market_casper">Casper (CSPR)</div>
				<div className="cd_we_market_casper_price">
					<div className="cd_we_market_casper_price-price">
						{toFormattedCurrency(currentPrice, { maximumSignificantDigits: 4 })}
					</div>
					<div
						className={`cd_we_market_casper_price-change ${
							csprMarketInfo.price_change_percentage_24h < 0 ? 'down' : 'up'
						}`}
					>
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M9.15143 7.20173L5.94971 4L2.74798 7.20173"
								stroke="#5FC88F"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						{toFormattedNumber(csprMarketInfo.price_change_percentage_24h, { maximumSignificantDigits: 3 })}
						%
					</div>
				</div>
			</div>
			<div className="cd_we_market_price_chart">
				<ChartLine data={priceHistory} height={150} chartOptions={chartOptions} />
			</div>
			<div className="cd_we_market_info">
				<div className="cd_we_market_info_item">
					<div className="cd_we_market_info_title">Marketcap</div>
					<div className="cd_we_market_info_value">{toFormattedCurrency(csprMarketInfo.market_cap)}</div>
				</div>
				<div className="cd_we_market_info_item">
					<div className="cd_we_market_info_title">24h Volume</div>
					<div className="cd_we_market_info_value">{toFormattedCurrency(csprMarketInfo.total_volume)}</div>
				</div>
				<div className="cd_we_market_info_item">
					<div className="cd_we_market_info_title">Total Supply</div>
					<div className="cd_we_market_info_value">{toFormattedNumber(csprMarketInfo.total_supply)}</div>
				</div>
				<div className="cd_we_market_info_item">
					<div className="cd_we_market_info_title">Circulating supply</div>
					<div className="cd_we_market_info_value">
						{toFormattedNumber(csprMarketInfo.circulating_supply)}
					</div>
				</div>
			</div>
			<div className="cd_we_transaction_history">
				<div className="cd_we_input_label">Transaction</div>
				<Grid
					data={transferList}
					metadata={TRANSFER_METADATA}
					className="cd_we_market_history "
					onRowClick={onTransactionClick}
				/>
			</div>
		</section>
	);
};

export default Market;
