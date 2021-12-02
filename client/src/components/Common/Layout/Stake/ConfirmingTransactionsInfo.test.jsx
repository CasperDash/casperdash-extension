import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ConfirmingTransactionsInfo from './ConfirmingTransactionsInfo';
afterEach(cleanup);

describe('ConfirmingTransactionsInfo', () => {
	test('Should return undefined if there is no transactions', () => {
		expect(ConfirmingTransactionsInfo()).toBe(undefined);
	});

	test('Render when there are more than two transactions', () => {
		expect(ConfirmingTransactionsInfo([1, 2]).props.children[0]).toBe('Confirming transactions ...');
	});

	test('Render when there is only transactions', () => {
		expect(ConfirmingTransactionsInfo([1]).props.children[0]).toBe('Confirming transaction ...');
	});
});
