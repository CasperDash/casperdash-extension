import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
// import { useSelector } from 'react-redux';
// import { selectCreateWalletCurrentStep } from '@cd/selectors/createWallet';
import './ImportWallet.scss';

const ImportWallet = () => {
	const pasteEventHandler = (event) => {
		console.log('>> PASTE: ', event.clipboardData.getData('text'));
	};
	useEffect(() => {
		window.addEventListener('paste', pasteEventHandler);

		return () => window.removeEventListener('paste', pasteEventHandler);
	}, []);
	return (
		<section className="cd_we_page--root">
			<div className="cd_we_create-wallet-layout--root">
				<div className="cd_we_create-wallet-layout--body">
					<p>Paste your keyphrase (12 words) here</p>
					<div>
						<input />
					</div>
				</div>
				<div className="cd_we_page--bottom">
					<Button className="cd_we_btn-next" onClick={() => {}}>
						Next
					</Button>
				</div>
			</div>
		</section>
	);
};

export default ImportWallet;
