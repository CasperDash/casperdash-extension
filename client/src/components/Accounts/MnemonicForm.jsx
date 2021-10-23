import React from 'react';
import { Link } from 'react-router-dom';
import * as bip39 from 'bip39';

export const MnemonicForm = ({ onCreateWallet }) => {
	const mnemonicPhase = bip39.generateMnemonic(256);
	const passPhaseArr = mnemonicPhase.split(' ');

	return (
		<>
			<p className="cd_create_wallet_paragraph">
				DO NOT FORGET to save your mnemonic phrase. You will need this to access your wallet.
			</p>
			<div className="cd_create_wallet_row row">
				{passPhaseArr.map((inputValue, i) => (
					<div className="cd_create_wallet_col_3 col-lg-3 col-md-6" key={inputValue}>
						<div className="cd_create_wallet_input_content position-relative">
							<p className="cd_create_wallet_input_text">{i + 1}</p>
							<input
								type="text"
								className="cd_create_wallet_input"
								name={`input${inputValue}`}
								placeholder="________"
								value={inputValue}
								disabled
							/>
						</div>
					</div>
				))}
			</div>
			<div className="cd_create_wallet_btn">
				<Link to={'#'} className="mx-auto" onClick={() => onCreateWallet(mnemonicPhase)}>
					I wrote down my mnemonic
				</Link>
			</div>
		</>
	);
};
