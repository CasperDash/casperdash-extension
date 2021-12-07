import React from 'react';

const CustomOptLabel = (e) => (
	<div>
		<div>
			{e.icon} {e.label}
		</div>
		<div>
			<small>Rate: {e.rate}%</small>
		</div>
	</div>
);

export default CustomOptLabel;
