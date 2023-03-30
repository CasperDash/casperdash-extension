import React from 'react';
import { useSelector } from 'react-redux';
import { ChartLine } from '../../Common/Layout/Chart';
import { getPriceHistory, getCurrentPrice, getLatestMarketInfo } from '../../../selectors/price';
import { toFormattedCurrency, toFormattedNumber } from '../../../helpers/format';
import { TransactionHistory } from '../Common/TransactionHistory';
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

const Market = () => {
	// Hook
	const priceHistory = useSelector(getPriceHistory);
	const currentPrice = useSelector(getCurrentPrice);
	const csprMarketInfo = useSelector(getLatestMarketInfo);

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
							csprMarketInfo.percent_change_24h < 0 ? 'down' : 'up'
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
						{toFormattedNumber(csprMarketInfo.percent_change_24h, { maximumSignificantDigits: 3 })}%
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
					<div className="cd_we_market_info_value">{toFormattedCurrency(csprMarketInfo.volume_24h)}</div>
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
				<TransactionHistory symbol="CSPR" />
			</div>
		</section>
	);
};

export default Market;
