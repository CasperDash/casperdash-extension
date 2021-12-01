import React from 'react';

const TableActions = ({ validator, unDelegateFunc, disableAction }) => {
	return (
		<>
			<span
				className={`cd_tbl_action_undelegate ${disableAction ? 'disabled' : ''}`}
				onClick={() => unDelegateFunc(validator)}
			>
				Undelegate
			</span>
		</>
	);
};

export default TableActions;
