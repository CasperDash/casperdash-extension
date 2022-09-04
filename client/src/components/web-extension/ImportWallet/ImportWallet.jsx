import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { selectCreateWalletCurrentStep } from '@cd/selectors/createWallet';
import CreatePasswordPage from '@cd/web-extension/Common/CreatePasswordPage';
import ImportWalletPage from './ImportWalletPage';
import './ImportWallet.scss';

const ImportWallet = () => {
	const [, setHeader] = useOutletContext();
	const currentStep = useSelector(selectCreateWalletCurrentStep);
	useEffect(() => {
		if (currentStep === 0) {
			setHeader('Import keyphrase');
		}

		if (currentStep === 1) {
			setHeader('Enter password');
		}
	}, [currentStep, setHeader]);
	return (
		<section className="cd_we_page--root">
			{currentStep === 0 && <ImportWalletPage />}
			{currentStep === 1 && <CreatePasswordPage />}
		</section>
	);
};

export default ImportWallet;
