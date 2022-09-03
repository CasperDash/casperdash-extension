import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field, useFormikContext } from 'formik';

const FieldKeyphrase = ({ totalWords }) => {
	const keys = Object.keys(new Array(totalWords).fill(''));
	const { setFieldValue } = useFormikContext();

	const pasteEventHandler = useCallback((event) => {
		event.preventDefault();
		
		const pasteData = event.clipboardData.getData('text');
		setFieldValue('keyphrase', pasteData.split(' '));
	}, [setFieldValue]);

	useEffect(() => {
		window.addEventListener('paste', pasteEventHandler);

		return () => window.removeEventListener('paste', pasteEventHandler);
	}, []);

	return (
		<ul className="cd_we_create-keyphrase--column">
			{keys?.map((word, index) => (
				<li className="cd_we_keyphrase--word" key={`left-${word}`}>
					<span className="counter">{index + 1}</span>
					<span className="value">
						<Field name={`keyphrase[${index}]`}/>
					</span>
				</li>
			))}
		</ul>
	)
}

FieldKeyphrase.propTypes = {
	totalWords: PropTypes.number.isRequired
}

export default FieldKeyphrase;
