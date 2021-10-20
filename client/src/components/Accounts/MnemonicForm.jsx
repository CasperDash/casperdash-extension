import React from 'react';
import { Link } from 'react-router-dom';

export const MnemonicForm = () => {
	const inputField = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	return (
		<>
			<p className="cd_create_wallet_paragraph">
				DO NOT FORGET to save your mnemonic phrase. You will need this to access your wallet.
			</p>
			<div className="cd_create_wallet_row row">
				{inputField.map((inputValue, i) => (
					<div className="cd_create_wallet_col_3 col-lg-3 col-md-6" key={inputValue}>
						<div className="cd_create_wallet_input_content position-relative">
							<p className="cd_create_wallet_input_text">{inputValue}</p>
							<input
								type="text"
								className="cd_create_wallet_input"
								name={`input${inputValue}`}
								placeholder="________"
							/>
						</div>
					</div>
				))}
			</div>
			<div className="cd_create_wallet_btn">
				<Link to={'/dashboard'} className="mx-auto">
					I wrote down my mnemonic
				</Link>
			</div>
		</>
	);
};
