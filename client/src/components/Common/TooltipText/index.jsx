import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './index.scss';

export const TooltipText = ({ tooltip, children, placement = 'auto' }) => {
	return (
		<OverlayTrigger placement={placement} overlay={<Tooltip>{tooltip}</Tooltip>}>
			<span className="cd_we_tooltip">
				{children}
			</span>
		</OverlayTrigger>
	);
};

TooltipText.propTypes = {
	children: PropTypes.element,
	placement: PropTypes.string,
	tooltip: PropTypes.string,
};
