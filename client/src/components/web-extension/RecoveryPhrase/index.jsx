import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import EnterPasswordModal from '@cd/web-extension/Common/LoginModal/EnterPasswordModal';
import { getKeyphrase } from '@cd/components/hooks/useServiceWorker';
import CanvasText from '@cd/web-extension/Common/CanvasText/index';
import { mnemonicToShares, sharesToMnemonic } from '@cd/helpers/shareable';

import './RecoveryPhrase.scss';

const RecoveryPhrase = () => {
	const navigate = useNavigate();

	const [isBlurred, setIsBlurred] = useState(true);
	const [showEnterPassword, setShowEnterPassword] = useState(true);
	const [shares, setShares] = useState('');

	const TOTAL_KEYWORDS = sharesToMnemonic(shares).split(' ').length;

	const onViewRecoveryPhrase = useCallback(async (password) => {
		try {
			const gotShares = mnemonicToShares(await getKeyphrase(password));

			setShares(gotShares);
			setShowEnterPassword(false);
		} catch (error) {
			throw Error('Wrong password provided. Please try again');
		}
	}, []);


	return (
		<div className="cd_we_recovery-keyphrase">
			<div className="cd_we_recovery-keyphrase__wrapper">
				<div
					className={clsx({
						'cd_we_recovery-keyphrase__blur': isBlurred,
					})}
					onClick={() => setIsBlurred(false)}
				>
					<ul
						className={clsx('cd_we_recovery-keyphrase__column', {
							'cd_we_recovery-keyphrase__column--blurred': isBlurred,
						})}
					>
						{shares && new Array(TOTAL_KEYWORDS).fill().map((_, index) => (
							<li className="cd_we_recovery-keyphrase__word" key={`left-${index}`}>
								<CanvasText text={`${index + 1}. ${sharesToMnemonic(shares).split(' ')[index]}`} width="80" height="22" />
							</li>
						))}
					</ul>
					{isBlurred && (
						<div className="cd_we_recovery-keyphrase__blur-overlay">
							Click to reveal secret recovery phrase
						</div>
					)}
				</div>
			</div>
			<div className="cd_we_recovery-keyphrase__warning">
				<div className="cd_we_recovery-keyphrase__warning-text">
					Please copy your secret recovery phrase and keep it in a safe place. If you lose your device or
					uninstall the extension, you will need this phrase to recover your wallet.
				</div>
			</div>
			{showEnterPassword && (
				<EnterPasswordModal
					isOpen={showEnterPassword}
					onCloseModal={() => {
						setShowEnterPassword(false);
						navigate('/');
					}}
					title="View Recovery Phrase"
					description="Enter password to continue"
					onSubmitPassword={onViewRecoveryPhrase}
				/>
			)}
		</div>
	);
};

RecoveryPhrase.propTypes = {
	keyphrase: PropTypes.string,
};

export default RecoveryPhrase;
