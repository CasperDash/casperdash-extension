import _get from 'lodash-es/get';
import React from 'react';
import PropTypes from 'prop-types';
import { getValueByFormat } from '../../../../helpers/format';
import './index.scss';

const Grid = ({ data = [], metadata = {}, onRowClick, className }) => {
	return (
		<div className={`cd_we_grid ${className || ''}`}>
			{data.map((value, i) => {
				const canClick = typeof onRowClick === 'function';
				return (
					<div
						className={`cd_we_item ${canClick ? 'clickable' : ''} `}
						key={i}
						onClick={() => canClick && onRowClick(value)}
					>
						{Object.keys(metadata).map((key) => {
							return (
								<div className={`cd_we_item_${key}`} key={key}>
									{metadata[key].map((item, i) => {
										const Component = item.component;
										const formattedValue = getValueByFormat(_get(value, item.key), {
											format: item.format,
										});
										return (
											<div
												className={`cd_we_item_value ${item.type} ${
													item.valueAsClass ? formattedValue : ''
												}`}
												key={i}
											>
												{Component ? <Component>{formattedValue}</Component> : formattedValue}
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
	/**
	 * On row click
	 */
	onRowClick: PropTypes.func,
};

export default Grid;
