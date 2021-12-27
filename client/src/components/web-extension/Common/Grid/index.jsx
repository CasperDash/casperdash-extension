import _get from 'lodash-es/get';
import React from 'react';
import PropTypes from 'prop-types';
import { getValueByFormat } from '../../../../helpers/format';
import './index.scss';

const Grid = ({ data = [], metadata = {} }) => {
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

Grid.propTypes = {
	/**
	 * Data display on grid
	 */
	data: PropTypes.array,
	/**
	 * Metadata of data pass to grid,
	 * each row will have max to 2 columns: left and right
	 * each column will have n items
	 * value for each item will get from data by key and format by type(css class) and format (formatter function)
	 * e.g {left:[{key: 'symbol',type:'primary'}],right:[{key: 'symbol',type:'primary'},{key: 'symbol', type:'secondary'}]}
	 */
	metadata: PropTypes.shape({
		left: PropTypes.arrayOf(
			PropTypes.shape({
				key: PropTypes.string,
				type: PropTypes.string,
				format: PropTypes.string,
			}),
		),
		right: PropTypes.arrayOf(
			PropTypes.shape({
				key: PropTypes.string,
				type: PropTypes.string,
				format: PropTypes.string,
			}),
		),
	}),
};

export default Grid;
