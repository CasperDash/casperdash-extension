import { cleanup } from '@testing-library/react';
import * as redux from 'react-redux';
import React from 'react';
import { getLedgerPublicKey, initLedgerApp, getLedgerError } from '../../services/ledgerServices';
import { setPublicKey } from '../../actions/userActions';
import useLedger from './useLedger';
import { joinRequest } from '@redux-requests/core';

jest.mock('../../actions/userActions', () => {
	return {
		__esModule: true,
		setPublicKey: jest.fn(),
	};
});

jest.mock('../../services/ledgerServices', () => {
	return {
		__esModule: true,
		initLedgerApp: jest.fn(),
		getLedgerPublicKey: jest.fn(),
		getLedgerError: jest.fn(),
	};
});

jest.mock('../../actions/deployActions', () => {
	return {
		__esModule: true,
		getTransferDeploysStatus: jest.fn(),
	};
});
afterEach(cleanup);
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

	jest.spyOn(React, 'useEffect').mockImplementationOnce(() => {});
});

test('Is using ledger', async () => {
	spyOnUseSelector.mockReturnValue({
		connectionType: 'ledger',
	});
	const { isUsingLedger } = useLedger();
	expect(isUsingLedger).toBe(true);
});

test('Handle connect ledger without error', async () => {
	initLedgerApp.mockReturnValue({
		casperApp: {},
		transport: {
			close: jest.fn(),
		},
	});

	getLedgerPublicKey.mockReturnValue('0x123');
	const { handleConnectLedger } = useLedger();
	const result = await handleConnectLedger();
	expect(result.publicKey).toBe('0x123');
	expect(result.keyIndex).toBe(0);
	expect(setPublicKey).toHaveBeenCalledWith('0x123', {
		connectionType: 'ledger',
		keyIndex: 0,
	});
});
// test('Ledger cannot connect', async () => {
// 	spyOnUseSelector.mockReturnValue({
// 		casperApp: {},
// 		ledgerKeys: ['0x123'],
// 	});
// 	getLedgerPublicKey.mockReturnValue({});
// 	const { isLedgerConnected } = useLedger();
// 	expect(await isLedgerConnected()).toBe(false);
// });

test('Handle connect ledger with error', async () => {
	initLedgerApp.mockReturnValue({
		casperApp: {},
		transport: {
			close: jest.fn(),
		},
	});
	getLedgerPublicKey.mockRejectedValue(new Error('Async error'));
	const { handleConnectLedger } = useLedger();
	const result = await handleConnectLedger();
	expect(result).toBe(undefined);
});
