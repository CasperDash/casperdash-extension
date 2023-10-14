import React, { useCallback, useState, useEffect } from 'react';
import { Button, Form as FormBS } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { KeyFactory } from 'casper-storage';
import { setNextStep, updateKeyphrase } from '@cd/actions/createWalletActions';
import SelectEncryptionType from '@cd/web-extension/Common/SelectEncryptionType';
import { CONSTANTS } from '@cd/shared/constants';
import NumberRecoveryWordsSelect from '@cd/web-extension/Common/NumberRecoveryWordsSelect';
import { NUMBER_OF_RECOVERY_WORDS } from '@cd/constants/key';
import FieldKeyphrase from './FieldKeyphrase';

const ImportWallet = () => {
	const dispatch = useDispatch();

	const [numberOfWords, setNumberOfWords] = useState(NUMBER_OF_RECOVERY_WORDS[0]);
	const [recoveryPhrase, setRecoveryPhrase] = useState([]);
	const [errorMessage, setErrorMessage] = useState('');

	const onValidate = useCallback((values) => {
		let error = '';
		/**
		 * Make sure keyphrase has 12 words
		 */
		if (values.some((key) => key.trim() === '')) {
			error = 'Keyphrase required.';
			return error;
		}

		/**
		 * Make sure keyphrase is valid with `KeyFactory.getInstance().validate(keyphrase)`
		 */
		if (!KeyFactory.getInstance().validate(values.map((value) => value.trim()).join(' '))) {
			error = 'Keyphrase is invalid. Please recheck your keyphrase.';
			return error;
		}

		return error;
	}, []);

	const onSubmit = () => {
		const error = onValidate(recoveryPhrase);
		setErrorMessage(error);
		if (!error) {
			dispatch(updateKeyphrase(recoveryPhrase.map((value) => value.trim()).join(' ')));
			dispatch(setNextStep());
		}
	};

	const pasteEventHandler = useCallback(
		(event) => {
			event.preventDefault();

			const pasteData = event.clipboardData.getData('text');
			const words = pasteData.split(' ');
			if (numberOfWords - words.length <= 0) {
				setRecoveryPhrase(words.slice(0, numberOfWords));
				return;
			}

			const filledWords = words.concat(new Array(numberOfWords - words.length).fill(''));
			setRecoveryPhrase(filledWords);
		},
		[numberOfWords],
	);

	useEffect(() => {
		return () => {
			// Clear keyphrase when unmount component to speed up memory release.
			setRecoveryPhrase([]);
		}
	}, []);

	useEffect(() => {
		// Only allow paste on debug
		if (CONSTANTS.DEBUG_ENV) {
			window.addEventListener('paste', pasteEventHandler);

			return () => window.removeEventListener('paste', pasteEventHandler);
		}
	}, [pasteEventHandler]);

	const onPhraseChange = (index, value) => {
		const newPhrase = [...recoveryPhrase];
		newPhrase[index] = value;
		setRecoveryPhrase(newPhrase);
	};

	return (
		<div className="cd_we_create-wallet-layout--root">
			<SelectEncryptionType />
			<NumberRecoveryWordsSelect onChange={(number) => setNumberOfWords(number)} selectedValue={numberOfWords} />
			<div className="cd_we_create-wallet-layout--body cd_we_create-keyphrase--box">
				<FieldKeyphrase
					totalWords={numberOfWords}
					onPhraseChange={onPhraseChange}
					recoveryPhrase={recoveryPhrase}
				/>
			</div>
			{errorMessage && <FormBS.Text className="invalid-feedback">{errorMessage}</FormBS.Text>}
			<div className="cd_we_page--bottom">
				<Button className="cd_we_btn-next" onClick={onSubmit}>
					Next
				</Button>
			</div>
		</div>
	);
};

ImportWallet.propTypes = {};

export default ImportWallet;
