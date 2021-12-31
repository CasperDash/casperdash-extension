import React from 'react';
import { Button } from 'react-bootstrap';

const StakeButton = ({ show, handleToggle }) => (
	<div className={`cd_send_currency_btn_text cd_btn_stake_cspr ${show ? '' : 'hide'}`}>
		<Button className=" cd_send_currency_btn" onClick={handleToggle}>
			Stake CSPR
		</Button>
	</div>
);

export default StakeButton;
