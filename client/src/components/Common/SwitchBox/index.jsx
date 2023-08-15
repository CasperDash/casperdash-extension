import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
const SwitchBox = ({checked, onClick}) => {
	return (
		<label className="switch">
			<input type="checkbox" checked={checked} onClick={onClick} />
			<span className="slider round" />
		</label>
	)
}

SwitchBox.propTypes = {
	checked: PropTypes.bool,
	onClick: PropTypes.func,
}

export default SwitchBox;