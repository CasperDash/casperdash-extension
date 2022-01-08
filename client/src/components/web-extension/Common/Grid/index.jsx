import _get from 'lodash-es/get';
import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from '../../../Common/Spinner';
import NoData from '../../../Common/NoData';
import { getValueByFormat } from '../../../../helpers/format';
import './index.scss';

const Grid = ({ data = [], metadata = {}, onRowClick, className, isLoading }) => {
	return (
		<div className={`cd_we_grid ${className || ''}`}>
			{!isLoading && !data.length && <NoData />}
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
									{key === 'left' && value.icon && (
										<div
											className={`cd_we_grid_icon ${
												metadata.left ? metadata.left.iconClassName || '' : ''
											}`}
										>
											<img src={value.icon} alt="grid" />
										</div>
									)}
									<div className="cd_we_item_content">
										{metadata[key].map((item, i) => {
											const Component = item.component;
											const WrapperComponent = item.wrapperComponent;
											const compProps = item.props || {};
											const formattedValue = getValueByFormat(
												item.value || _get(value, item.key),
												{
													format: item.format,
												},
											);
											return (
												<div
													className={`cd_we_item_value ${item.type} ${
														item.valueAsClass ? formattedValue : ''
													}`}
													key={i}
												>
													{WrapperComponent ? (
														<WrapperComponent>{formattedValue}</WrapperComponent>
													) : Component ? (
														<Component {...compProps} {...value} value={formattedValue} />
													) : (
														formattedValue
													)}{' '}
													{item.suffix}
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				);
			})}
			{isLoading && <Bar />}
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
