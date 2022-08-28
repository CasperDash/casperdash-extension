import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field, useFormikContext } from 'formik';

const FieldKeyphrase = ({ totalWords }) => {
	const	leftKeys = Object.keys(new Array(totalWords/2).fill(''));
	const rightKeys = Object.keys(new Array(totalWords/2).fill(''));
	const { setFieldValue } = useFormikContext();

	const pasteEventHandler = useCallback((event) => {
		console.log('>> PASTE: ', event.clipboardData.getData('text'));
		const pasteData = event.clipboardData.getData('text');
		console.log(`🚀 ~ pasteEventHandler ~ pasteData`, pasteData)
		setFieldValue('keyphrase', pasteData.split(' '));
	}, [setFieldValue]);
	useEffect(() => {
		window.addEventListener('paste', pasteEventHandler);

		return () => window.removeEventListener('paste', pasteEventHandler);
	}, []);

	return (
		<>
			<ul className="cd_we_create-keyphrase--column">
				{leftKeys?.map((word, index) => (
					<li className="cd_we_keyphrase--word" key={`left-${word}`}>
						<span className="counter">{index + 1}</span>
						<span className="value">
							<Field name={`keyphrase[${index}]`} />
						</span>
						{/* <span className="value">{word}</span> */}
					</li>
				))}
			</ul>
			<ul className="cd_we_create-keyphrase--column">
				{rightKeys?.map((word, index) => (
					<li className="cd_we_keyphrase--word" key={`right-${word}`}>
						<span className="counter">{index + (1 + totalWords / 2)}</span>
						<Field name={`keyphrase[${index + totalWords / 2}]`} />
						{/* <span className="value">{word}</span> */}
					</li>
				))}
			</ul>
		</>
	)
}

FieldKeyphrase.propTypes = {
	totalWords: PropTypes.number.isRequired
}

export default FieldKeyphrase;
