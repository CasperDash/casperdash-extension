import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { viewInExplorer } from '../../../helpers/redirect';

const CommonAction = ({ type, value }) => {
	const [copyText, setCopyText] = useState('Copy');

	const onClickCopy = () => {
		navigator.clipboard.writeText(value);
		setCopyText('Copied');
		setTimeout(() => {
			setCopyText('Copy');
		}, 1000);
	};

	return (
		<>
			<OverlayTrigger placement="top" overlay={<Tooltip>{copyText}</Tooltip>}>
				<i className="bi bi-clipboard cd_btn_copy" onClick={onClickCopy} />
			</OverlayTrigger>

			<OverlayTrigger placement="top" overlay={<Tooltip>View in explorer</Tooltip>}>
				<i
					className="bi bi-box-arrow-up-right cd_btn_explorer"
					onClick={() => viewInExplorer({ type, value })}
				/>
			</OverlayTrigger>
		</>
	);
};

export default CommonAction;
