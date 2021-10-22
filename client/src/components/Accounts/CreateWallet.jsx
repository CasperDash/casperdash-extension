import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CreatePassword } from './CreatePassword';
import { MnemonicForm } from './MnemonicForm';
import { Link, useHistory } from 'react-router-dom';
import { createNewHDWallet } from '../../services/casperServices';
import { setSelectedWallet, updateStorageWalletInfo, updateCryptoInstance } from '../../actions/userActions';

const STEPS = [CreatePassword, MnemonicForm];

export const CreateWallet = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [step, setStep] = useState(0);
	const CurrentStepComp = STEPS[step] || STEPS[0];
	const [hasError, setHasError] = useState(false);
	const [finalPassword, setFinalPassword] = useState('');
	const disabled = hasError || !finalPassword;

	const onCreateWallet = (passPhase) => {
		const hdWallet = createNewHDWallet(passPhase);
		const wallet = hdWallet.deriveIndex(1);
		dispatch(updateCryptoInstance(finalPassword));
		dispatch(updateStorageWalletInfo(passPhase));
		dispatch(setSelectedWallet(wallet));
		history.push('/dashboard');
	};
	return (
		<section className="cd_create_wallet_section">
			<div className="cd_create_wallet_content container">
				<div className="cd_create_wallet_heading_text">
					<h3 className="cd_create_wallet_heading">Create New Wallet</h3>
				</div>

				<CurrentStepComp
					finalPassword={finalPassword}
					setFinalPassword={setFinalPassword}
					setHasError={setHasError}
					onCreateWallet={onCreateWallet}
				/>

				<div className="cd_create_wallet_btn">
					{step > 0 && (
						<Link to={'#'} className="mx-auto" onClick={() => setStep(step - 1)}>
							Back
						</Link>
					)}
					{step < STEPS.length - 1 && (
						<Link
							to={'#'}
							className={`mx-auto ${disabled ? 'disabled' : ''}`}
							onClick={() => !disabled && setStep(step + 1)}
						>
							Next
						</Link>
					)}
				</div>
			</div>
		</section>
	);
};
