import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCreateWalletCurrentStep } from '@cd/selectors/createWallet';
import CreatePasswordPage from '@cd/web-extension/Common/CreatePasswordPage';
import { useOutletContext } from 'react-router-dom';
import { generateCWHeader } from '@cd/actions/createWalletActions.utils';
import RecoveryPhrasePage from './RecoveryPhrasePage';
import ValidateKeyphrasePage from './ValidateKeyphrasePage';
import './CreateWallet.scss';

const CreateWallet = () => {
	const [, setHeader] = useOutletContext();
	const currentStep = useSelector(selectCreateWalletCurrentStep);
	
  /**
	 * Reset header so OuterHeader can show correct name
	 */
	useEffect(() => {
		setHeader(generateCWHeader(currentStep));
	}, [currentStep, setHeader]);
	return (
		<section className="cd_we_page--root">
			{currentStep === 0 && <RecoveryPhrasePage />}
			{currentStep === 1 && <ValidateKeyphrasePage />}
			{currentStep === 2 && <CreatePasswordPage />}
		</section>
	);
};

export default CreateWallet;
