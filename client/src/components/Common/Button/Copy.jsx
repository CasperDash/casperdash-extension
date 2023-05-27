import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './Copy.scss';

const Copy = ({ value }) => {
	const [copyText, setCopyText] = useState('Copy');

	const onClickCopy = () => {
		navigator.clipboard.writeText(value);
		setCopyText('Copied');
		setTimeout(() => {
			setCopyText('Copy');
		}, 1000);
	};

	return (
		<OverlayTrigger placement="top" overlay={<Tooltip>{copyText}</Tooltip>}>
			<svg
    width="11"
    height="11"
    viewBox="0 0 11 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClickCopy}
    className="cd_btn_copy"
			>
				<path
     fillRule="evenodd"
     clipRule="evenodd"
     d="M0 0H1H9V1H1V9H0V0ZM2 2H11V11H2V2ZM3 3H10V10H3V3Z"
     fill="#989a9b"
				/>
			</svg>
		</OverlayTrigger>
	);
};

export default Copy;
