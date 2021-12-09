import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { ChartLine } from './index';

afterEach(cleanup);
jest.mock('react-apexcharts', () => {
	return {
		__esModule: true,
		default: () => {
			return <div>chart</div>;
		},
	};
});

test('Should show chart', () => {
	const { getByText } = render(<ChartLine data={[[1635132561297, '0.1075']]} />);
	expect(getByText('chart').textContent).toBe('chart');
});
