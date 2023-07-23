import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import CopyIcon from '@cd/assets/image/copy-icon.svg';
import CheckIcon from '@cd/assets/image/check-alt.svg';

import './Copy.scss';

const Copy = ({ value }) => {
	const [isCoppied, setIsCoppied] = useState(false);

	const onClickCopy = () => {
		navigator.clipboard.writeText(value);
		setIsCoppied(true);
		setTimeout(() => {
			setIsCoppied(false);
		}, 1000);
	};

	return (
		<>
			<div className="cd_btn_copy" onClick={onClickCopy} data-tooltip-id="copy-tooltip">
				{isCoppied ? <CheckIcon className="cd_btn_copy--checked" /> : <CopyIcon />}
			</div>
			<Tooltip id="copy-tooltip">Copy</Tooltip>
		</>
	);
};

export default Copy;
