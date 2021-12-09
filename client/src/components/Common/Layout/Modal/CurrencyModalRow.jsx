import React from 'react';
import { toFormattedCurrency } from '../../../../helpers/format';
import SingleCurrencyRow from './SingleCurrencyRow';

const CurrencyModalRow = ({ label, amount = 0, currency = 'CSPR', currentPrice, customClass }) => (
	<>
		<div className={`cd_confirm_modal_row ${customClass}`}>
			<span className="cd_confirm_modal_label">{label}</span>
			<span className="cd_confirm_modal_value">
				{amount} <b>{currency}</b>
			</span>
		</div>
		<SingleCurrencyRow amount={toFormattedCurrency(amount * currentPrice)} />
	</>
);

export default CurrencyModalRow;
