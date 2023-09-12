import React from 'react';
import { TailSpin } from '@cd/common/Spinner';

const OverlayLoader = () => {
	return (
		<div
			style={{
				background: 'white',
				height: '100%',
				position: 'fixed',
				width: '100%',
				zIndex: 100,
				alignItems: 'center',
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<TailSpin />
		</div>
	);
};

export default OverlayLoader;
