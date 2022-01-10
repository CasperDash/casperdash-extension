import React from 'react';
import * as redux from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { LedgerKeysModal } from './LedgerKeysModal';

afterEach(cleanup);
jest.mock('../../../../selectors/user', () => {
	return {
		__esModule: true,
		getLoginOptions: () => {
			return new Promise((resolve) => {
				resolve('connected');
			});
		},
	};
});

let spyOnUseSelector;
let spyOnUseDispatch;
let mockDispatch;
beforeEach(() => {
	// Mock useSelector hook
	spyOnUseSelector = jest.spyOn(redux, 'useSelector');
	// Mock useDispatch hook
	spyOnUseDispatch = jest.spyOn(redux, 'useDispatch');
	// Mock dispatch function returned from useDispatch
	mockDispatch = jest.fn();
	spyOnUseDispatch.mockReturnValue(mockDispatch);
});

test('Should show Ledger Keys Modal', () => {
	spyOnUseSelector.mockReturnValue({});
	const { getByText } = render(<LedgerKeysModal show={true} keys={[{ publicKey: '0x123', path: '00' }]} />);
	expect(getByText('Select the account').textContent).toBe('Select the account');
});
