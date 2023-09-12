import React, { useState } from 'react';
import Eye from '@cd/assets/image/ic-eye.svg';
import EyeOff from '@cd/assets/image/ic-eye-off.svg';
import './KeyInput.scss';

export const KeyInput = ({ value, index, itemIndex, onPhraseChange }) => {
	const [showValue, setShowValue] = useState(false);

	return (
		<div className="value">
			<input
				type={!showValue ? 'password' : 'text'}
				value={value}
				name={`keyphrase[${index}]`}
				onChange={(e) => onPhraseChange(itemIndex, e.target.value)}
			/>
			{!showValue ? <Eye onClick={() => setShowValue(true)} /> : <EyeOff onClick={() => setShowValue(false)} />}
		</div>
	);
};
