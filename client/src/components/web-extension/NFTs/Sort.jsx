import React from 'react';
import ArrowUpIcon from 'assets/image/arrow-up.svg';

const SORT_BY = [
	{ label: 'Collectible', attr: 'collectible' },
	{ label: 'Name', attr: 'name' },
];

export const Sort = ({ onSortClick, sortObj }) => {
	return (
		<div className="cd_we_nft_sort">
			{SORT_BY.map(({ attr, label }) => {
				const orderBy = sortObj.attr === attr ? sortObj.order : 'asc';
				return (
					<div key={attr} className="cd_we_nft_sort_by" onClick={() => onSortClick(attr)}>
						{label}
						{orderBy === 'asc' ? <ArrowUpIcon className="cd_we_nft_order_by_desc" /> : <ArrowUpIcon />}
					</div>
				);
			})}
		</div>
	);
};
