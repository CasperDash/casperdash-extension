import React from 'react';
import { Alert } from 'react-bootstrap';
import HeadingModule from '../HeadingComponent/Heading';

const UnlockSingerWarning = ({ title, message }) => (
	<section className="cd_staking_page">
		<HeadingModule name={title} />
		<div className="cd_staking_casper_locked">
			<div className="cd_main_message">
				<Alert variant="danger">{message}</Alert>
			</div>
		</div>
	</section>
);

export default UnlockSingerWarning;
