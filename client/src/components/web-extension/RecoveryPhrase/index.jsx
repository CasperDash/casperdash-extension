import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DownloadButton } from '@cd/components/web-extension/Common/DownloadButton';
import EnterPasswordModal from '@cd/web-extension/Common/LoginModal/EnterPasswordModal';
import { getKeyphrase } from '@cd/components/hooks/useServiceWorker';
import { useNavigate } from 'react-router-dom';

import './RecoveryPhrase.scss';

const RecoveryPhrase = () => {
	const navigate = useNavigate();

	const [showEnterPassword, setShowEnterPassword] = useState(true);
	const [keyphrase, setKeyphrase] = useState('');

	const onViewRecoveryPhrase = useCallback(async (password) => {
		try {
			const keyPhrase = await getKeyphrase(password);
			setKeyphrase(keyPhrase);
			setShowEnterPassword(false);
		} catch (error) {
			throw Error('Wrong password provided. Please try again');
		}
	}, []);

	const words = keyphrase ? keyphrase.split(' ') : [];

	return (
		<div className="cd_we_recovery-keyphrase">
			<div className="cd_we_recovery-keyphrase__wrapper">
				<ul className="cd_we_recovery-keyphrase__column">
					{words?.map((word, index) => (
						<li className="cd_we_recovery-keyphrase__word" key={`left-${index}`}>
							<span className="counter">{index + 1}</span>
							<span className="value">{word}</span>
						</li>
					))}
				</ul>
				<div className="cd_we_recovery-keyphrase__footer">
					<DownloadButton
						className="cd_we_recovery-keyphrase__copy-btn"
						text={keyphrase}
						fileName="key_phrase.txt"
					/>
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
