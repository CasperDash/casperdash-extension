import React from 'react';
import { Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './index.scss';

export const TooltipText = ({ tooltip, children }) => {
	return (
		<div>
			<span className="cd_we_tooltip" data-tooltip-id="cd-tooltip-text" data-tooltip-content={tooltip}>
				{children}
			</span>
			<Tooltip id="cd-tooltip-text" />
		</div>
	);
};

TooltipText.propTypes = {
	children: PropTypes.element,
	placement: PropTypes.string,
	tooltip: PropTypes.string,
};
