import React from 'react';

export const ContractField = (field) => (
	<div>
		<div>
			{field.label} - {field.symbol}
		</div>
		<div>
			<small>{field.value}</small>
		</div>
	</div>
);
