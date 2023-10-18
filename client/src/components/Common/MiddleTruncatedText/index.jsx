import React from 'react';
import { Tooltip } from 'react-tooltip';
import clsx from 'clsx';
import { getEndString } from '@cd/helpers/format';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';

import './MiddleTruncatedText.scss';

export const MiddleTruncatedText = ({ children, end, className, placement = 'top' }) => {
	const endString = getEndString(children, end);
	const beginString = !endString ? children : children.slice(0, children.length - endString.length);
	const id = nanoid();
	return (
		<>
			<div
				className={clsx('cd_middle_truncated_text', className)}
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

MiddleTruncatedText.propTypes = {
	children: PropTypes.string.isRequired,
	end: PropTypes.number,
	className: PropTypes.string,
	placement: PropTypes.string
}

MiddleTruncatedText.defaultProps = {
	end: 5,
};
