import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createNewHDWallet } from '../../services/casperServices';
import { setSelectedWallet, updateStorageWalletInfo, updateCryptoInstance } from '../../actions/userActions';
import { getRedirectPath } from '../../selectors/user';
import { CreatePassword } from './CreatePassword';
import { MnemonicForm } from './MnemonicForm';

const STEPS = [CreatePassword, MnemonicForm];

export const CreateWallet = (props) => {
	const dispatch = useDispatch();
	const history = useHistory();

	const redirectPath = useSelector(getRedirectPath);
	const mode = props.match.params.mode;
	const [step, setStep] = useState(0);
	const CurrentStepComp = STEPS[step] || STEPS[0];
	const [hasError, setHasError] = useState(false);
	const [finalPassword, setFinalPassword] = useState('');
	const disabled = hasError || !finalPassword;

	const onCreateWallet = (mnemonicPhase) => {
		const hdWallet = createNewHDWallet(mnemonicPhase);
		const wallet = hdWallet.deriveIndex(0);
		const selectedWallet = { wallet, deriveIndex: 0, name: 'Main Account' };
		dispatch(updateCryptoInstance(finalPassword));
		dispatch(
			updateStorageWalletInfo({
				mnemonicPhase,
				derivedWallets: [selectedWallet],
			}),
		);

		dispatch(setSelectedWallet(selectedWallet));
		try {
			const path = JSON.parse(window.atob(redirectPath));
			history.push(path);
		} catch {
			history.push('/dashboard');
		}
	};
	return (
		<section className="cd_create_wallet_section">
			<div className="cd_create_wallet_content container">
				<div className="cd_create_wallet_heading_text">
					<h3 className="cd_create_wallet_heading">{`${
						mode === 'create' ? 'Create New' : 'Restore'
					} Wallet`}</h3>
				</div>

				<CurrentStepComp
					finalPassword={finalPassword}
					setFinalPassword={setFinalPassword}
					setHasError={setHasError}
					onCreateWallet={onCreateWallet}
					mode={mode}
				/>

				<div className="cd_create_wallet_btn">
					{step > 0 && (
						<button
							className="mx-auto btn"
							onClick={() => {
								setHasError(false);
								setStep(step - 1);
							}}
						>
							Back
						</button>
					)}
					{step < STEPS.length - 1 && (
						<button
							className={`mx-auto btn ${disabled ? 'disabled' : ''}`}
							onClick={() => !disabled && setStep(step + 1)}
						>
							Next
						</button>
					)}
				</div>
			</div>
		</section>
	);
};
