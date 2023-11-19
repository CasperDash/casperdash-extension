import React from 'react';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import copyToClipBoard from 'copy-to-clipboard';
import useTimeout from '@cd/components/hooks/useTimeout';

const CopyButton = ({ text, className, delay }) => {
	const [btnText, setBtnText] = useState('Copy');

	const startTimeOut = useTimeout(() => {
		copyToClipBoard(' ');
	}, delay);

	const backToCopy = useTimeout(() => {
		setBtnText('Copy');
	}, 1000);

	const onCopy = () => {
		copyToClipBoard(text);
		if (delay) {
			startTimeOut();
		}

		setBtnText('Copied');
		backToCopy();
	};

	return (
		<Button variant="primary" onClick={onCopy} className={className}>
			{btnText}
		</Button>
	);
};

export default CopyButton;
