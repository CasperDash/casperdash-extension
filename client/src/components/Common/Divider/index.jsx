import React from 'react';
import './Divider.scss';
import { clsx } from 'clsx';

const Divider = ({ width = '100%', className }) => {
	return (
		<div className={clsx('divider', className)}>
			<hr className="solid" style={{width}}/>
		</div>
	);
};

export default Divider;
