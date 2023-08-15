import React from 'react';
import cn from 'classnames';
import { Button } from 'react-bootstrap';
import { EncoderUtils } from 'casper-storage';
import './WordsGroup.scss';

const WordsGroup = (props) => {
	const {
		groupIndex,
		data: { answer, options, value },
		onSelect,
	} = props;
	return (
		<div className="cd_we_wordsgroup">
			<p className="cd_we_wordsgroup-intro">Select word #{answer.id + 1}</p>
			<div className="cd_we_wordsgroup-container">
				{options.map((option) => {
					const isChecked = value === option;
					return (
						<Button
							variant="outline"
							key={option}
							className={cn({
								'cd_we_wordsgroup-word': true,
								'is-active': isChecked,
							})}
							onClick={() => {
								onSelect(groupIndex, option);
							}}
						>
							{EncoderUtils.decodeBase64(option)}
						</Button>
					);
				})}
			</div>
		</div>
	);
};

export default WordsGroup;
