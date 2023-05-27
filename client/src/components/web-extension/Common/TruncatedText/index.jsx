import React from 'react';
import clsx from 'clsx';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './TruncatedText.scss';

export const TruncatedText = ({ children, placement = 'top', className = ''}) => {
	return (
		<OverlayTrigger placement={placement} overlay={<Tooltip>{children}</Tooltip>}>
			<div className="cd_truncated">
				<p className={clsx('cd_truncated__text', className)}>{children}</p>
			</div>
		</OverlayTrigger>
	);
};