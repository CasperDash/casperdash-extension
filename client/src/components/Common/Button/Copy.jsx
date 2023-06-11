import React, { useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
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
		<OverlayTrigger placement="top" overlay={<Popover className="cd_btn_copy_popover">Copy</Popover>}>
			<div className="cd_btn_copy" onClick={onClickCopy}>
			{
				isCoppied ? (
					<CheckIcon className="cd_btn_copy--checked"/>
				): (
					<CopyIcon />
				)
			}
		</div>
		</OverlayTrigger>
	);
};

export default Copy;
