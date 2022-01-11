import { cleanup } from '@testing-library/react';
import * as redux from 'react-redux';
import React from 'react';
import { getLedgerPublicKey, initLedgerApp, getListKeys, getLedgerError } from '../../services/ledgerServices';
import { getLocalStorageValue, setLocalStorageValue } from '../../services/localStorage';
import { setPublicKey } from '../../actions/userActions';
import useLedger from './useLedger';

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
		getListKeys: jest.fn(),
	};
});

jest.mock('../../actions/deployActions', () => {
	return {
		__esModule: true,
		getTransferDeploysStatus: jest.fn(),
	};
});

jest.mock('../../services/localStorage', () => {
	return {
		__esModule: true,
		setLocalStorageValue: jest.fn(),
		getLocalStorageValue: jest.fn(),
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

test('Load more keys having cached keys', async () => {
	getLocalStorageValue.mockReturnValue([{ publicKey: '0x123' }]);
	const { loadMoreKeys } = useLedger();
	const keys = await loadMoreKeys('0x123', 2);
	expect(keys.length).toBe(1);
	expect(keys[0].publicKey).toBe('0x123');
});

test('Load more keys without cached keys', async () => {
	getLocalStorageValue.mockReturnValue([{}]);
	getListKeys.mockReturnValue([
		{
			publicKey: '0x123',
		},
		{
			publicKey: '0x124',
		},
	]);
	const { loadMoreKeys } = useLedger();
	const keys = await loadMoreKeys();
	expect(setLocalStorageValue).toHaveBeenCalledWith(
		'ledger',
		'keys',
		[
			{
				publicKey: '0x123',
			},
			{
				publicKey: '0x124',
			},
		],
		'set',
	);
	expect(keys.length).toBe(2);
});

test('Load more keys with error', async () => {
	getLocalStorageValue.mockReturnValue([{}]);
	getListKeys.mockRejectedValue(new Error('Async Error'));
	const { loadMoreKeys } = useLedger();
	const keys = await loadMoreKeys();
	expect(getLedgerError).toHaveBeenCalledWith(new Error('Async Error'));
	expect(keys.length).toBe(0);
});
