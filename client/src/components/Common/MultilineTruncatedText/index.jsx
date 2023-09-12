import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './MultilineTruncatedText.scss';

export const MultilineTruncatedText = ({ children, placement = 'top' }) => {
	return (
		<OverlayTrigger placement={placement} overlay={<Tooltip>{children}</Tooltip>}>
			<div className="cd_multiline_truncated">
				<p className="cd_multiline_truncated__text">{children}</p>
			</div>
		</OverlayTrigger>
	);
};