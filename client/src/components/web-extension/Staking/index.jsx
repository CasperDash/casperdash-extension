import React from 'react';
import { Button } from 'react-bootstrap';
import './Staking.scss';

const Staking = () => {
	return (
		<section className="cd_we_staking">
			<div className="cd_we_staking_inputs">
				<div className="cd_we_staking_amount">
					<div className="cd_we_staking_amount_header">
						<div className="cd_we_input_label">Amount</div>
						<div>Balance: 871</div>
					</div>
					<div className="cd_we_staking_amount_text_box">
						<input />
						<div className="cd_we_amount_max_btn">Max</div>
					</div>
				</div>
				<div className="cd_we_staking_validator">
					<div className="cd_we_input_label">Validator</div>
					<input />
				</div>
				<Button>Stake Now</Button>
			</div>
			<div className="cd_we_staking_info">
				<div className="cd_we_staking_info_title">Staked Information</div>
			</div>
		</section>
	);
};

export default Staking;
