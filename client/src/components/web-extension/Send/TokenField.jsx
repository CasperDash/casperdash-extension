import React from 'react';
import { toFormattedNumber } from '../../../helpers/format';
import './TokenField.scss';

export const TokenField = (field) => (
	<div className="cd_send_token_field">
		<div>{field.symbol}</div>
		<div>{field.balance && toFormattedNumber(field.balance.displayValue)}</div>
	</div>
);
