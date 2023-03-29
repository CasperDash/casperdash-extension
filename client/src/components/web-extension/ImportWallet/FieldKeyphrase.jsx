import React from 'react';
import PropTypes from 'prop-types';
import { KeyInput } from './KeyInput';

const FieldKeyphrase = ({ totalWords, onPhraseChange, recoveryPhrase }) => {
	const keys = Object.keys(new Array(totalWords).fill(''));
	const numberPerCol = keys.length / 2;
	return new Array(2).fill().map((_, i) => {
		return (
			<ul className="cd_we_import-keyphrase--column" key={i}>
				{keys?.map((word, index) => {
					const itemIndex = i * numberPerCol + index;
					return (
						index < numberPerCol && (
							<li className="cd_we_keyphrase--word" key={`left-${word}`}>
								<span className="counter">{itemIndex + 1}</span>
								<KeyInput
									value={recoveryPhrase[itemIndex]}
									index={index}
									itemIndex={itemIndex}
									onPhraseChange={onPhraseChange}
								/>
								{/* <span className="value">
									<input
										type="password"
										value={recoveryPhrase[itemIndex]}
										name={`keyphrase[${index}]`}
										onChange={(e) => onPhraseChange(itemIndex, e.target.value)}
									/>
								</span> */}
							</li>
						)
					);
				})}
			</ul>
		);
	});
};

FieldKeyphrase.propTypes = {
	totalWords: PropTypes.number.isRequired,
};

export default FieldKeyphrase;
