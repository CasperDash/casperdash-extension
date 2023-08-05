import React, { useCallback, useEffect, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import drop from 'lodash-es/drop';
import dropRight from 'lodash-es/dropRight';
import { generateKeyphrase, setNextStep } from '@cd/actions/createWalletActions';
import SelectEncryptionType from '@cd/web-extension/Common/SelectEncryptionType';
import SelectDerivationPath from '@cd/web-extension/Common/SelectDerivationPath';
import NumberRecoveryWordsSelect from '@cd/web-extension/Common/NumberRecoveryWordsSelect';
import { selectCreateWalletKeyphrase } from '@cd/selectors/createWallet';
import { NUMBER_OF_RECOVERY_WORDS } from '@cd/constants/key';
import CanvasText from '@cd/web-extension/Common/CanvasText/index';
import { EncoderUtils } from 'casper-storage';
import { toEncodedPhrase } from '@cd/helpers/shareable';

import './RecoveryPhrasePage.scss';

const RecoveryPhrasePage = () => {
	const dispatch = useDispatch();
	const [numOfWords, setNumOfWords] = useState(NUMBER_OF_RECOVERY_WORDS[0]);
	const [encodedPhrase, setEncodedPhrase] = useState([]);
	const keyPhrase = useSelector(selectCreateWalletKeyphrase);

	useEffect(() => {
		if (keyPhrase) {
			setEncodedPhrase(toEncodedPhrase(keyPhrase));
		}
	}, [keyPhrase]);

	const onClickNextHandler = useCallback(() => {
		dispatch(setNextStep());
	}, [dispatch]);

	useEffect(() => {
		dispatch(generateKeyphrase(numOfWords));
	}, [numOfWords, dispatch]);

	return encodedPhrase.length ? (
		<div className="cd_we_create-wallet-layout--root">
			<SelectEncryptionType />
			<SelectDerivationPath />
			<NumberRecoveryWordsSelect
				selectedValue={numOfWords}
				onChange={(number) => {
					setNumOfWords(number);
				}}
			/>
			<div className="cd_we_create-wallet-layout--body cd_we_create-keyphrase--box">
				<ul className="cd_we_create-keyphrase--column">
					<Stage width={100} height={300}>
						<Layer>
							{dropRight(new Array(numOfWords).fill(), numOfWords / 2)?.map((_, index) => {
								const eleIndex = index + 1;

								return (
									<CanvasText
										key={`left-${index}-${nanoid()}`}
										text={`${eleIndex}. ${
											encodedPhrase[index] && EncoderUtils.decodeBase64(encodedPhrase[index])
										}`}
										x={10}
										y={22 * index}
									/>
								);
							})}
						</Layer>
					</Stage>
				</ul>
				<ul className="cd_we_create-keyphrase--column">
					<Stage width={100} height={300}>
						<Layer>
							{drop(new Array(numOfWords).fill(), numOfWords / 2)?.map((_, index) => {
								const eleIndex = index + (1 + numOfWords / 2);

								return (
									<CanvasText
										key={`right-${index}-${nanoid()}`}
										text={`${eleIndex}. ${
											encodedPhrase[eleIndex - 1] &&
											EncoderUtils.decodeBase64(encodedPhrase[eleIndex - 1])
										}`}
										x={10}
										y={22 * index}
									/>
								);
							})}
						</Layer>
					</Stage>
				</ul>
			</div>
			<div className="cd_we_create-keyphrase--actions">
				{/* <CopyButton className="cd_we_create-keyphrase__btn" text={keyPhrase} delay={ONE_MINUTE} /> */}
				<Button onClick={onClickNextHandler} className="cd_we_create-keyphrase__btn">
					Next
				</Button>
			</div>
		</div>
	) : null;
};

export default RecoveryPhrasePage;
