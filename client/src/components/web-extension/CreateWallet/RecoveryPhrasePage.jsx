import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import drop from 'lodash-es/drop';
import dropRight from 'lodash-es/dropRight';
import { generateKeyphrase, setNextStep } from '@cd/actions/createWalletActions';
import SelectEncryptionType from '@cd/web-extension/Common/SelectEncryptionType';
import NumberRecoveryWordsSelect from '@cd/web-extension/Common/NumberRecoveryWordsSelect';
import CopyButton from '@cd/web-extension/Common/CopyButton';
import { selectCreateWalletKeyphraseAsMap, selectCreateWalletKeyphrase } from '@cd/selectors/createWallet';
import { NUMBER_OF_RECOVERY_WORDS } from '@cd/constants/key';
import { ONE_MINUTE } from '@cd/constants/time';

import './RecoveryPhrasePage.scss';

const RecoveryPhrasePage = () => {
	const dispatch = useDispatch();
	const [numOfWords, setNumOfWords] = useState(NUMBER_OF_RECOVERY_WORDS[0]);
	const keyPhrase = useSelector(selectCreateWalletKeyphrase);
	const keyPhraseAsMap = useSelector(selectCreateWalletKeyphraseAsMap);
	const keyPhraseAsArray = Array.from(keyPhraseAsMap.values());
	const TOTAL_KEYWORDS = keyPhraseAsArray.length;
	const leftKeys = dropRight(keyPhraseAsArray, TOTAL_KEYWORDS / 2);
	const rightKeys = drop(keyPhraseAsArray, TOTAL_KEYWORDS / 2);

	const onClickNextHandler = useCallback(() => {
		dispatch(setNextStep());
	}, [dispatch]);

	useEffect(() => {
		dispatch(generateKeyphrase(numOfWords));
	}, [numOfWords, dispatch]);

	return (
		<div className="cd_we_create-wallet-layout--root">
			<SelectEncryptionType />
			<NumberRecoveryWordsSelect
				selectedValue={numOfWords}
				onChange={(number) => {
					setNumOfWords(number);
				}}
			/>
			<div className="cd_we_create-wallet-layout--body cd_we_create-keyphrase--box">
				<ul className="cd_we_create-keyphrase--column">
					{leftKeys?.map((word, index) => (
						<li className="cd_we_keyphrase--word" key={`left-${word}`}>
							<span className="counter">{index + 1}</span>
							<span className="value">{word}</span>
						</li>
					))}
				</ul>
				<ul className="cd_we_create-keyphrase--column">
					{rightKeys?.map((word, index) => (
						<li className="cd_we_keyphrase--word" key={`right-${word}`}>
							<span className="counter">{index + (1 + TOTAL_KEYWORDS / 2)}</span>
							<span className="value">{word}</span>
						</li>
					))}
				</ul>
			</div>
			<div className="cd_we_create-keyphrase--actions">
				<CopyButton
					className="cd_we_create-keyphrase__btn"
					text={keyPhrase}
					delay={ONE_MINUTE}
				/>
				<Button onClick={onClickNextHandler} className="cd_we_create-keyphrase__btn">
					Next
				</Button>
			</div>
		</div>
	);
};

export default RecoveryPhrasePage;
