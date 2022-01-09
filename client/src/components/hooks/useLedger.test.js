import { cleanup } from '@testing-library/react';
import * as redux from 'react-redux';
import React from 'react';
import { getLedgerPublicKey } from '../../services/ledgerServices';
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

test('Ledger is connected', async () => {
	spyOnUseSelector.mockReturnValue({
		casperApp: {},
		ledgerKeys: ['0x123'],
	});
	getLedgerPublicKey.mockReturnValue({
		publicKey: '0x123',
	});
	const { isLedgerConnected } = useLedger();
	expect(await isLedgerConnected()).toBe('0x123');
});

test('Ledger cannot connect', async () => {
	spyOnUseSelector.mockReturnValue({
		casperApp: {},
		ledgerKeys: ['0x123'],
	});
	getLedgerPublicKey.mockReturnValue({});
	const { isLedgerConnected } = useLedger();
	expect(await isLedgerConnected()).toBe(false);
});

test('Ledger throw exceptions when connecting', async () => {
	spyOnUseSelector.mockReturnValue({ casperApp: {}, ledgerKeys: ['0x123'] });
	getLedgerPublicKey.mockRejectedValue(new Error('Async error'));
	const { isLedgerConnected } = useLedger();
	expect(await isLedgerConnected()).toBe(false);
});
