import React, { useState, useEffect } from 'react';
import * as bip39 from 'bip39';

export const MnemonicForm = ({ onCreateWallet, mode, setHasError }) => {
	const [mnemonicPhaseArr, setMnemonicPhaseArr] = useState([]);
	const [errors, setErrors] = useState({});
	const [pasted, setPasted] = useState(false);

	useEffect(() => {
		const mnemonicPhase = mode === 'create' ? bip39.generateMnemonic(256).split(' ') : new Array(24).fill('');
		setMnemonicPhaseArr(mnemonicPhase);
	}, [mode]);

	const onUpdatePhase = (index, value) => {
		if (!pasted) {
			const mnemonicPhase = [...mnemonicPhaseArr];
			mnemonicPhase[index] = value;
			setMnemonicPhaseArr(mnemonicPhase);
		}
		setPasted(false);
	};

	const onSubmitPhase = () => {
		const mnemonicPhase = mnemonicPhaseArr.join(' ');
		if (!bip39.validateMnemonic(mnemonicPhase)) {
			setErrors({ mnemonicPhase: 'Invalid mnemonic phase.' });
			setHasError(true);
			return;
		}
		onCreateWallet(mnemonicPhase);
	};

	const onPaste = (e, i) => {
		setPasted(true);
		const mnemonicPhase = [...mnemonicPhaseArr];
		const data = e.clipboardData.getData('text').trim();
		const dataArr = data.split(' ');
		for (let index = i, k = 0; index < mnemonicPhaseArr.length; index++, k++) {
			mnemonicPhase[index] = dataArr[k];
		}
		setMnemonicPhaseArr(mnemonicPhase);
	};

	return (
		<>
			<p className="cd_create_wallet_paragraph">
				{mode == 'create'
					? 'DO NOT FORGET to save your mnemonic phrase. You will need this to access your wallet.'
					: 'Please input your mnemonic phrase.'}
			</p>
			<div className="cd_create_wallet_row row">
				{mnemonicPhaseArr.map((inputValue, i) => (
					<div className="cd_create_wallet_col_3 col-lg-3 col-md-6" key={i}>
						<div className="cd_create_wallet_input_content position-relative">
							<p className="cd_create_wallet_input_text">{i + 1}</p>
							<input
								type="text"
								className="cd_create_wallet_input"
								name={`input${inputValue}`}
								placeholder="________"
								value={inputValue}
								disabled={mode === 'create'}
								onChange={(e) => onUpdatePhase(i, e.target.value)}
								onPaste={(e) => onPaste(e, i)}
							/>
						</div>
					</div>
				))}
			</div>
			{mode === 'create' && (
				<p
					className="cd_create_wallet_copy_mnemonic"
					onClick={() => navigator.clipboard.writeText(mnemonicPhaseArr.join(' '))}
				>
					Copy mnemonic phase
				</p>
			)}
			{errors.mnemonicPhase && <p className="cd_create_wallet_error">{errors.mnemonicPhase}</p>}
			<div className="cd_create_wallet_btn">
				<button to={'#'} className="mx-auto btn" onClick={onSubmitPhase}>
					{mode === 'create' ? 'I wrote down my mnemonic' : 'Restore'}
				</button>{' '}
			</div>
		</>
	);
};
