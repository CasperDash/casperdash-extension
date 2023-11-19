import React from 'react';
import { LineChart, XAxis, YAxis, Line, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

export const ChartLine = ({ data, height = 300 }) => {
	return (
		<ResponsiveContainer width="100%" height={height}>
			<LineChart data={data}>
				<XAxis dataKey="date" style={{ fontSize: '10px' }} />
				<YAxis
					dataKey="price"
					unit="$"
					orientation="right"
					domain={['dataMin', 'dataMax']}
					style={{ fontSize: '10px' }}
					axisLine={false}
				/>
				<Line type="monotone" dataKey="price" stroke="#0d6efd" dot={false} />
				<CartesianGrid strokeDasharray="3 3" vertical={false} />
				<Tooltip />
			</LineChart>
		</ResponsiveContainer>
	);
};
