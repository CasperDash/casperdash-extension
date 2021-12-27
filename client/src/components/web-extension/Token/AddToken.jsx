import React from 'react';
import { Button } from 'react-bootstrap';
import './AddToken.scss';

export const AddToken = () => {
	return (
		<section className="cd_we_add_token">
			<div>Token Address</div>
			<input value="" />
			<Button>Add</Button>
		</section>
	);
};
