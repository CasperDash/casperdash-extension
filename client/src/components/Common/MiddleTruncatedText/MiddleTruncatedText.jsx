import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export const MiddleTruncatedText = ({ children, end, placement = 'top' }) => {
	const endString = getEndString(children, end);
	const beginString = !endString ? children : children.slice(0, children.length - endString.length);
	return (
		<OverlayTrigger placement={placement} overlay={<Tooltip>{children}</Tooltip>}>
			<div className="cd_middle_truncated_text">
				<div className="cd_middle_truncated_text-begin">{beginString}</div>
				<div className="cd_middle_truncated_text-end">{endString}</div>
			</div>
		</OverlayTrigger>
	);
};

MiddleTruncatedText.defaultProps = {
	end: 5,
};

function getEndString(fullString, end) {
	if (typeof end === 'string') {
		return end;
	} else if (typeof end === 'number') {
		return fullString.slice(-Math.abs(end));
	} else if (end instanceof window.RegExp) {
		const match = fullString.match(end);
		if (!match) {
			return '';
		}
		const index = match.index;
		return fullString.slice(index);
	}
}
