import React, { useState } from 'react';
import { CreatePassword } from './CreatePassword';
import { MnemonicForm } from './MnemonicForm';
import { Link } from 'react-router-dom';

const STEPS = [CreatePassword, MnemonicForm];

export const CreateWallet = () => {
	const [step, setStep] = useState(0);
	const CurrentStepComp = STEPS[step] || STEPS[0];
	return (
		<section className="cd_create_wallet_section">
			<div className="cd_create_wallet_content container">
				<div className="cd_create_wallet_heading_text">
					<h3 className="cd_create_wallet_heading">Create New Wallet</h3>
				</div>

				<CurrentStepComp />

				<div className="cd_securebackup_btn">
					{step > 0 && (
						<Link to={'#'} className="mx-auto" onClick={() => setStep(step - 1)}>
							Back
						</Link>
					)}
					{step < STEPS.length - 1 && (
						<Link to={'#'} className="mx-auto" onClick={() => setStep(step + 1)}>
							Next
						</Link>
					)}
				</div>
			</div>
		</section>
	);
};
