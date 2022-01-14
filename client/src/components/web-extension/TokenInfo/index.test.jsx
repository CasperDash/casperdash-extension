/* eslint-disable react/no-multi-comp */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { useTokenInfo } from '../../hooks/useTokensInfo';
import TokenDetails from './index';

afterEach(cleanup);

jest.mock('../../hooks/useTokensInfo', () => ({
	useTokenInfo: jest.fn(),
}));

jest.mock('../Common/SendReceiveButtons', () => ({ SendReceive: () => <div>SendReceive</div> }));
jest.mock('../Common/TransactionHistory', () => ({ TransactionHistory: () => <div>Transaction History</div> }));

test('Should show token details', async () => {
	useTokenInfo.mockReturnValue({ tokenInfoByAddress: {} });
	useLocation.mockReturnValue({ state: {} });

	const { getByText } = render(<TokenDetails />);
	expect(getByText('SendReceive').textContent).toBe('SendReceive');
	expect(getByText('Transaction History').textContent).toBe('Transaction History');
	expect(getByText('~ $0.00').textContent).toBe('~ $0.00');
});
