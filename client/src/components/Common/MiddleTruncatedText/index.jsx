import React from 'react';
import { Tooltip } from 'react-tooltip';
import { getEndString } from '@cd/helpers/format';
import './MiddleTruncatedText.scss';
import { nanoid } from 'nanoid';

export const MiddleTruncatedText = ({ children, end, placement = 'top' }) => {
	const endString = getEndString(children, end);
	const beginString = !endString ? children : children.slice(0, children.length - endString.length);
	const id = nanoid();
	return (
		<>
			<div
				className="cd_middle_truncated_text"
				data-tooltip-id={`tooltip-middle-truncated-text-${id}`}
				data-tooltip-place={placement}
			>
				<div className="cd_middle_truncated_text-begin">{beginString}</div>
				<div className="cd_middle_truncated_text-end">{endString}</div>
			</div>
			<Tooltip id={`tooltip-middle-truncated-text-${id}`}>
				<div className="cd_middle_truncated_tooltip_content">{children}</div>
			</Tooltip>
		</>
	);
};

MiddleTruncatedText.defaultProps = {
	end: 5,
};
