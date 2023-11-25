import { getCurrentPrice } from '@cd/selectors/price';
import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Legend } from 'recharts';
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import CloseIcon from '@cd/assets/image/close-icon.svg';
import { toFormattedCurrency, toFormattedNumber } from '@cd/helpers/format';
import './AccountAssetsChart.scss';
import useBalanceVisible from '@cd/components/hooks/useBalanceVisible';

const COLORS = ['blue', 'orange', 'gold', 'cyan', 'grey'];

export const AccountAssetsChart = ({
	activeCSPRAmount = 0,
	stakedCSPRAmount = 0,
	undelegatingCSPRAmount = 0,
	totalFiatBalance = 0,
	isOpen,
	onClose,
}) => {
	// Hooks
	const { isBalanceVisible } = useBalanceVisible();

	// Selectors
	const currentPrice = useSelector(getCurrentPrice);
	const activeCSPRFiat = activeCSPRAmount * currentPrice;
	const stakedCSPRFiat = stakedCSPRAmount * currentPrice;
	const undelegatingCSPRFiat = undelegatingCSPRAmount * currentPrice;
	const otherAmount = totalFiatBalance - activeCSPRFiat - stakedCSPRFiat - undelegatingCSPRFiat;

	const data = [
		{ value: activeCSPRFiat, name: 'Liquid', CSPRAmount: activeCSPRAmount },
		{ value: stakedCSPRFiat, name: 'Staked', CSPRAmount: stakedCSPRAmount },
		{ value: undelegatingCSPRFiat, name: 'Undelegating', CSPRAmount: undelegatingCSPRAmount },
		// ignore other amount if it is too small
		{ value: otherAmount < 0.001 ? 0 : otherAmount, name: 'Other' },
		// default empty value

		!activeCSPRFiat &&
			!stakedCSPRFiat &&
			!undelegatingCSPRFiat &&
			!otherAmount && {
				value: 1,
				name: 'None',
			},
	].filter(Boolean);

	const renderLegend = (props) => {
		const { payload } = props;

		const getCSPRAmount = (value) => {
			return isBalanceVisible ? `${toFormattedNumber(value)} CSPR` : '*****';
		};

		const getFiatAmount = (value) => {
			return isBalanceVisible ? `${toFormattedCurrency(value)} ` : '*****';
		};

		return (
			<div>
				{payload.map(({ value, payload, color }, index) =>
					value === 'None' ? null : (
						<div key={`item-${index}`} className="cd_we_assets-modal__legend">
							<div className="legend_icon" style={{ backgroundColor: color }} />
							<div>
								<b>{value}:</b> {value !== 'Other' ? `${getCSPRAmount(payload.CSPRAmount)}` : ''} ~
								{getFiatAmount(payload.value)}{' '}
							</div>
						</div>
					),
				)}
			</div>
		);
	};

	return (
		<Modal show={isOpen} onHide={onClose} className="cd_we_account_assets-modal" centered>
			<Modal.Header>
				<div className="cd_we_assets-modal__title">Assets Detail</div>
				<button className="cd_we_assets-modal__btn-close" onClick={onClose}>
					<CloseIcon />
				</button>
			</Modal.Header>
			<Modal.Body>
				<ResponsiveContainer width="100%" height={300}>
					<PieChart width={200} height={200}>
						<Pie
							data={data}
							cx="50%"
							cy="40%"
							innerRadius={60}
							outerRadius={80}
							fill="#8884d8"
							paddingAngle={1}
							dataKey="value"
							minAngle={3}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Legend layout="vertical" iconType="circle" margin={{ top: 10 }} content={renderLegend} />
					</PieChart>
				</ResponsiveContainer>
			</Modal.Body>
		</Modal>
	);
};
