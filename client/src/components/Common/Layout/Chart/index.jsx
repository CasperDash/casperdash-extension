import React from 'react';
import Chart from 'react-apexcharts';

export const ChartLine = ({ data }) => {
	const options = {
		chart: {
			zoom: {
				enabled: false,
			},
			stacked: false,
		},
		xaxis: {
			borderColor: '#999',
			yAxisIndex: 0,
			type: 'datetime',
			tooltip: {
				enabled: false,
			},
			title: {
				text: 'Source - Coingecko',
				offsetX: 0,
				offsetY: 0,
			},
		},
		tooltip: {
			x: {
				format: 'ddd dd MMM yy, HH:mm',
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: 2,
			curve: 'smooth',
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.7,
				opacityTo: 0.2,
				stops: [0, 90, 100],
			},
		},
		series: [
			{
				type: 'area',
				name: 'Price',
				data: data,
			},
		],
	};
	return <Chart options={options} series={options.series} type="area" height={300} />;
};
