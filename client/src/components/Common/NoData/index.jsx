import React from 'react';
import CasperDashEmpty from 'assets/image/cd-nft-empty.png';
import './NoData.scss';

const NoData = ({ message }) => {
	return (
		<div className="cd_we_no_data">
			<img src={CasperDashEmpty} alt="no-data" />
			<div className="cd_we_no_data_message">{message || 'No Data'}</div>
		</div>
	);
};

export default NoData;
