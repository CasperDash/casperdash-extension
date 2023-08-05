import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Layer, Stage } from 'react-konva';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import EnterPasswordModal from '@cd/web-extension/Common/LoginModal/EnterPasswordModal';
import { getKeyphrase } from '@cd/components/hooks/useServiceWorker';
import CanvasText from '@cd/web-extension/Common/CanvasText';
import { EncoderUtils } from 'casper-storage';

import './RecoveryPhrase.scss';

const RecoveryPhrase = () => {
	const navigate = useNavigate();

	const [isBlurred, setIsBlurred] = useState(true);
	const [showEnterPassword, setShowEnterPassword] = useState(true);
	const [encodedKeyPhrase, setEncodedKeyPhrase] = useState([]);

	const TOTAL_KEYWORDS = encodedKeyPhrase.length;

	const onViewRecoveryPhrase = useCallback(async (password) => {
		try {
			const keyPhrase = await getKeyphrase(password);

			setEncodedKeyPhrase(keyPhrase);
			setShowEnterPassword(false);
		} catch (error) {
			throw Error('Wrong password provided. Please try again');
		}
	}, []);

	const height = TOTAL_KEYWORDS <= 12 ? 200 : 270;

	return (
		<div className="cd_we_recovery-keyphrase">
			<div className="cd_we_recovery-keyphrase__wrapper">
				<div
					className={clsx({
						'cd_we_recovery-keyphrase__blur': isBlurred,
					})}
					onClick={() => setIsBlurred(false)}
				>
					{encodedKeyPhrase.length && (
						<ul
							className={clsx('cd_we_recovery-keyphrase__column', {
								'cd_we_recovery-keyphrase__column--blurred': isBlurred,
							})}
						>
							<Stage width={100} height={height}>
								<Layer>
									{new Array(TOTAL_KEYWORDS / 2).fill().map((_, index) => (
										<CanvasText
											key={`left-${index}`}
											text={`${index + 1}. ${
												encodedKeyPhrase[index] &&
												EncoderUtils.decodeBase64(encodedKeyPhrase[index])
											}`}
											x={10}
											y={22 * index}
										/>
									))}
								</Layer>
							</Stage>
							<Stage width={100} height={height}>
								<Layer>
									{new Array(TOTAL_KEYWORDS / 2).fill().map((_, index) => {
										const eleIndex = index + TOTAL_KEYWORDS / 2;

										return (
											<CanvasText
												key={`right-${index}`}
												text={`${eleIndex + 1}. ${
													encodedKeyPhrase[eleIndex] &&
													EncoderUtils.decodeBase64(encodedKeyPhrase[eleIndex])
												}`}
												x={10}
												y={22 * index}
											/>
										);
									})}
								</Layer>
							</Stage>
						</ul>
					)}
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
