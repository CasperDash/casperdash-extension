import React from 'react';
import * as redux from 'react-redux';
import { render, cleanup, fireEvent } from '@testing-library/react';
import Heading from './Heading';

afterEach(cleanup);
jest.mock('../../../../selectors/signer', () => {
	return {
		__esModule: true,
		getSignerStatus: () => {},
		isConnectedCasper: () => {
			return new Promise((resolve) => {
				resolve('connected');
			});
		},
	};
});

jest.mock('../../../../services/localStorage', () => {
	return {
		setLocalStorageValue: jest.fn(),
		getLocalStorageValue: jest.fn(),
	};
});

jest.mock('../../../hooks/useCasperSigner', () => {
	return {
		__esModule: true,
		default: () => {
			return {
				ConnectSignerButton: () => <div />,
			};
		},
	};
});

jest.mock('../../../hooks/useLedger', () => {
	return {
		__esModule: true,
		default: () => {
			return {
				handleConnectLedger: jest.fn(),
				isUsingLedger: true,
				loadMoreKeys: jest.fn().mockReturnValue(false),
			};
		},
	};
});

jest.mock('../../../../selectors/settings', () => {
	return {
		__esModule: true,
		getTheme: jest.fn(),
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

test('Should load more ledger keys with no keys', async () => {
	spyOnUseSelector.mockReturnValue('cd_page_dark_mode').mockReturnValueOnce('');
	const { queryAllByText } = render(<Heading />);
	const loadMoreLedgerKeyBtn = queryAllByText('Load more keys')[0];
	await fireEvent.click(loadMoreLedgerKeyBtn);
	expect(queryAllByText('Loading')).toBeDefined();
});
