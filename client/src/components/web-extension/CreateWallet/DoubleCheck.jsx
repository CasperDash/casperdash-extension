import _sampleSize from 'lodash-es/sampleSize';
import _shuffle from 'lodash-es/shuffle';
import React, { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { NUMBER_OF_DOUBLE_CHECK_WORD, NUMBER_OF_DOUBLE_CHECK_WORD_PER_ROW } from '../../../constants/key';

export const DoubleCheck = () => {
	const {
		state: { phaseArray },
	} = useLocation();

	const randomWords = useMemo(() => _sampleSize(phaseArray, NUMBER_OF_DOUBLE_CHECK_WORD), [phaseArray]);

	const getRowItems = useCallback(
		(word) => {
			const restWords = phaseArray.filter((item) => item !== word);
			const saltWords = _sampleSize(restWords, NUMBER_OF_DOUBLE_CHECK_WORD_PER_ROW - 1);
			return _shuffle(saltWords.concat(word));
		},
		[phaseArray],
	);

	const wordRows = useMemo(
		() =>
			randomWords.map((word) => {
				return { words: getRowItems(word), wordIndex: phaseArray.indexOf(word), keyWord: word };
			}),
		[phaseArray, randomWords, getRowItems],
	);

	const [selectedItems, setSelectedItems] = useState(new Array(NUMBER_OF_DOUBLE_CHECK_WORD).fill());

	const onItemClick = (rowIndex, item) => {
		let cloneSelectedItems = [...selectedItems];
		cloneSelectedItems[rowIndex] = item;
		setSelectedItems(cloneSelectedItems);
	};

	const isDoubleCheckCorrect = () => {
		return (
			selectedItems.length === NUMBER_OF_DOUBLE_CHECK_WORD &&
			selectedItems.every((item) => randomWords.includes(item))
		);
	};

	return (
		<div className="cd_we_double_check">
			{wordRows.map((row, rowIndex) => {
				return (
					<div key={rowIndex} className="cd_we_double_check_row">
						<div className="cd_we_double_check_title">Select word # {row.wordIndex + 1}</div>
						<div className="cd_we_double_check_words">
							{row.words.map((item) => {
								return (
									<Button
										variant={selectedItems[rowIndex] === item ? 'primary' : 'primary-outline'}
										key={item}
										onClick={() => onItemClick(rowIndex, item)}
									>
										{item}
									</Button>
								);
							})}
						</div>
					</div>
				);
			})}
			<Button disabled={!isDoubleCheckCorrect()}>Next</Button>
		</div>
	);
};
