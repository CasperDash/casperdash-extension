import React from 'react';
import './index.scss';

export const Grid = ({ data = [] }) => {
	return (
		<div className="cd_we_grid">
			{data.map((v, i) => {
				return (
					<div className="cd_we_item" key={i}>
						<div className="cd_we_item_left">
							<div className="cd_we_item_main">CSPR</div>
							<div className="cd_we_item_sub">1000</div>
						</div>
						<div className="cd_we_item_right">
							<div className="cd_we_item_main">$1.000.48</div>
							<div className="cd_we_item_sub">$1.000.48</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
