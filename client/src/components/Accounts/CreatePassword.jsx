import React from 'react';
import { Form } from 'react-bootstrap';

export const CreatePassword = () => {
	return (
		<>
			<p className="cd_create_wallet_paragraph">
				To create a wallet, please pick a password first. This password will be used to guard access to
				CasperDash wallet.
			</p>

			<Form className="cd_create_wallet_input_list">
				<Form.Group className="cd_create_wallet_input_items">
					<Form.Label>New Password</Form.Label>
					<Form.Control type="password" placeholder="New Password" />
				</Form.Group>
				<Form.Group className="cd_create_wallet_input_items">
					<Form.Label>Repeat Password</Form.Label>
					<Form.Control type="password" placeholder="Repeat Password" />
				</Form.Group>
			</Form>
		</>
	);
};
