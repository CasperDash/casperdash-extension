import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { getEndString } from '@cd/helpers/format';
import './MiddleTruncatedText.scss';

export const MiddleTruncatedText = ({ children, end, start, placement = 'top' }) => {
	if (typeof children !== 'string') {
		return children;
	}

	if (children.length <= start + end) {
		return children;
	}

	const endString = getEndString(children, end);
	const beginString = !endString ? children : children.slice(0, start || children.length - endString.length);
	return (
		<OverlayTrigger placement={placement} overlay={<Tooltip>{children}</Tooltip>}>
			<div className="cd_middle_truncated_text">
				<div className="cd_middle_truncated_text-begin">{beginString}</div>
				{start && '...'}
				<div className="cd_middle_truncated_text-end">{endString}</div>
			</div>
		</OverlayTrigger>
	);
};

MiddleTruncatedText.defaultProps = {
	end: 5,
};
