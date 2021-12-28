import React from 'react';
import Copy from './Copy';
import ViewInExplorer from './ViewInExplorer';

const CommonAction = ({ type, value }) => {
	return (
		<>
			<Copy value={value} />
			<ViewInExplorer type={type} value={value} />
		</>
	);
};

export default CommonAction;
