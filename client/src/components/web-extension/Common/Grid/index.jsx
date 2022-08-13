import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash-es/get';
import isFunction from 'lodash-es/isFunction';
import { getValueByFormat } from '@cd/helpers/format';
import { Bar } from '@cd/common/Spinner';
import NoData from '@cd/common/NoData';
import './index.scss';

const Grid = ({ data = [], metadata = {}, onRowClick, className, isLoading }) => {
  // console.log(`🚀 ~ Grid ~ isLoading`, isLoading)
  // console.log(`🚀 ~ Grid ~ className`, className)
  // console.log(`🚀 ~ Grid ~ onRowClick`, onRowClick)
	// console.log(`🚀 ~ Grid ~ metadata`, metadata);
	console.log(`🚀 ~ Grid ~ data`, data);
	const EMPTY_BALANCE = 0;
	const getFormattedValue = useCallback((item, token) => {
		const isEmptyBalance = Boolean(token?.balance?.displayValue === 0);
		return item.key === 'price' && isEmptyBalance
			? EMPTY_BALANCE
			: getValueByFormat(item.value || get(token, item.key), {
					format: item.format,
			});
	}, []);
  const renderValue = useCallback(({item, token}, value) => {
    if (item.wrapperComponent) {
      return <item.wrapperComponent>{value}</item.wrapperComponent>
    };

    if (item.component) {
      return <item.component {...(item.props && { ...item.props })} {...token} value={value} />
    }
    
    return value;
  }, []);
	const renderGridItem = useCallback(
		(item, token) => {
			const formattedValue = getFormattedValue(item, token);
      const shouldRender = (isFunction(item?.shouldDisplay) && !item.shouldDisplay(get(token, item.key))) ||
				!get(token, item.key);
      
      if (shouldRender) {
        return null;
      }

			return  (
				<div className={`cd_we_item_value ${item.type} ${item.valueAsClass ? formattedValue : ''}`} key={`${item.key}-${token.symbol}`}>
					{renderValue({ item, token}, formattedValue)}
          {' '}
          {item.suffix}
				</div>
			);
		},
		[getFormattedValue, renderValue],
	);

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
									{key === 'left' &&
										value.icon &&
										(Array.isArray(value.icon) ? (
											value.icon.map((ic, i) => {
												return (
													<div
														key={i}
														className={`cd_we_grid_icon ${metadata?.left?.iconClassName ?? ""}`}
													>
														{ic && <img src={ic} alt="grid" />}
													</div>
												);
											})
										) : (
											<div
												className={`cd_we_grid_icon ${metadata?.left?.iconClassName ?? ""}`}
											>
												<img src={value.icon} alt="grid" />
											</div>
										))}
									<div className="cd_we_item_content">
										{metadata[key].map(item => renderGridItem(item, value))}
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
