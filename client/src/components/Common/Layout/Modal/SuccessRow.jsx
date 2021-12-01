import React from 'react';

const SuccessRow = ({ label, value, customClass }) => (
	<div className={`cd_confirm_modal_row ${customClass}`}>
		<span className="cd_confirm_modal_label">{label}</span>
		<span className="cd_confirm_modal_value_success">{value}</span>
	</div>
);

export default SuccessRow;
