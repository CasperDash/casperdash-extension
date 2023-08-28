import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash-es/get';
import cn from 'classnames';
import isFunction from 'lodash-es/isFunction';
import { getValueByFormat } from '@cd/helpers/format';
import { Bar } from '@cd/common/Spinner';
import NoData from '@cd/common/NoData';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Tooltip } from 'react-tooltip';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import clsx from 'clsx';

import './index.scss';

const Grid = ({
	data = [],
	metadata = {},
	onRowClick,
	className,
	isLoading,
	isInfiniteScroll,
	isVirtualList,
	infiniteScrollProps,
}) => {
	const getFormattedValue = useCallback((item, token) => {
		return getValueByFormat(item.value || get(token, item.key), {
			format: item.format,
			...item.formatOptions,
		});
	}, []);
	const renderValue = useCallback(({ item, token, index }, value) => {
		if (item.wrapperComponent) {
			return <item.wrapperComponent>{value}</item.wrapperComponent>;
		}

		if (item.component) {
			return (
				<item.component
					key={`gird-item-${index}`}
					{...(item.props && { ...item.props })}
					{...token}
					value={value}
				/>
			);
		}

		return value;
	}, []);
	const renderGridItem = useCallback(
		(item, token, i) => {
			const formattedValue = getFormattedValue(item, token);
			const shouldNotRender =
				(isFunction(item?.shouldDisplay) && !item.shouldDisplay(get(token, item.key))) ||
				get(token, item.key) === null;

			if (shouldNotRender) {
				return null;
			}
			const tooltip = item.tooltip
				? { 'data-tooltip-id': `grid-tooltip-${item.tooltip}-${i}`, 'data-tooltip-content': item.tooltip }
				: {};

			return (
				<>
					<div
						data-testid={`${token.symbol}-${item.key}`}
						className={clsx('cd_we_item_value', item.type, item.valueAsClass ? formattedValue : undefined)}
						key={`${token.symbol}-${item.key}`}
						{...tooltip}
					>
						{renderValue({ item, token, index: i }, formattedValue)} {item.suffix}
					</div>
					{item.tooltip && <Tooltip id={`grid-tooltip-${item.tooltip}-${i}`} style={{ width: '90%' }} />}
				</>
			);
		},
		[getFormattedValue, renderValue],
	);

	const rowRenderer = ({ index, style = {} }) => {
		const value = data[index];
		const canClick = typeof onRowClick === 'function';

		return (
			<div
				className={`cd_we_item ${canClick ? 'clickable' : ''} `}
				key={`grid-item-${index}`}
				onClick={() => canClick && onRowClick(value)}
				style={
					isVirtualList
						? {
								...style,
								paddingRight: '10px',
						  }
						: style
				}
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
												className={`cd_we_grid_icon ${
													metadata?.left?.iconClassName ?? ''
												} icon-${i}`}
											>
												{ic && <img src={ic} alt="grid" />}
											</div>
										);
									})
								) : (
									<div className={`cd_we_grid_icon ${metadata?.left?.iconClassName ?? ''}`}>
										<img src={value.icon} alt="grid" />
									</div>
								))}
							<div className="cd_we_item_content">
								{metadata[key].map((item) => renderGridItem(item, value, index))}
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	const renderContent = () => (
		<>
			{!isLoading && !data.length && <NoData />}
			{isVirtualList ? (
				<AutoSizer>
					{({ height, width }) => (
						<List
							width={width} // Width of the list
							height={height}
							itemCount={data.length}
							itemSize={60}
						>
							{rowRenderer}
						</List>
					)}
				</AutoSizer>
			) : (
				data.map((value, i) => {
					return rowRenderer({ index: i });
				})
			)}
			{isLoading && <Bar />}
		</>
	);

	const combinedClassName = cn('cd_we_grid', className);

	return isInfiniteScroll ? (
		<InfiniteScroll className={combinedClassName} {...infiniteScrollProps}>
			{renderContent()}
		</InfiniteScroll>
	) : (
		<div className={combinedClassName}>{renderContent()}</div>
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
