import React from 'react';
import { Tooltip } from 'react-tooltip';
import { getEndString } from '../../../helpers/format';
import './MiddleTruncatedText.scss';

export const MiddleTruncatedText = ({ children, end, placement = 'top' }) => {
	const endString = getEndString(children, end);
	const beginString = !endString ? children : children.slice(0, children.length - endString.length);
	return (
		<>
			<div
				className="cd_middle_truncated_text"
				data-tooltip-id="tooltip-middle-truncated-text"
				data-tooltip-place={placement}
			>
				<div className="cd_middle_truncated_text-begin">{beginString}</div>
				<div className="cd_middle_truncated_text-end">{endString}</div>
			</div>
			<Tooltip id="tooltip-middle-truncated-text">
				<div className="cd_middle_truncated_tooltip_content">{children}</div>
			</Tooltip>
		</>
	);
};

MiddleTruncatedText.defaultProps = {
	end: 5,
};
