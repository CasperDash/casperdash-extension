import React from 'react';
import _get from 'lodash-es/get';
import { getValueByFormat } from '../../../helpers/format';
import './index.scss';

export const Grid = ({ data = [], metadata = {} }) => {
	return (
		<div className="cd_we_grid">
			{data.map((value, i) => {
				return (
					<div className="cd_we_item" key={i}>
						{Object.keys(metadata).map((key) => {
							return (
								<div className={`cd_we_item_${key}`} key={key}>
									{metadata[key].map((item, i) => {
										return (
											<div className={`cd_we_item_value ${item.type}`} key={i}>
												{getValueByFormat(_get(value, item.key), { format: item.format })}
											</div>
										);
									})}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};
