import { getMutationSelector, getQuerySelector } from '@redux-requests/core';
import {
	deploySelector,
	getLatestBlockHashSelector,
	getLatestBlockHash,
	getTransfersDeploy,
	getPendingTransferDeployHash,
} from './deploy';

jest.mock('@redux-requests/core', () => {
	return {
		getMutationSelector: jest.fn().mockReturnValue(() => ({ data: {} })),
		getQuerySelector: jest.fn().mockReturnValue(() => ({ data: {} })),
	};
});

test('deploySelector should call getMutationSelector', () => {
	deploySelector;
	expect(getMutationSelector).toHaveBeenCalled();
});

test('getLatestBlockHashSelector should call getQuerySelector', () => {
	getLatestBlockHashSelector;
	expect(getQuerySelector).toHaveBeenCalled();
});

test('getLatestBlockHash should call createSelector', () => {
	const state = {};
	expect(getLatestBlockHash(state)).toEqual('');
});

test('getTransfersDeploy should return transfer by symbol', () => {
	expect(getTransfersDeploy('CDAS')({ deploys: { transfers: [{ symbol: 'CDAS' }] } })).toEqual([{ symbol: 'CDAS' }]);
	expect(getTransfersDeploy()({ deploys: { transfers: [{ name: 'Casper Dash' }] } })).toEqual([
		{ name: 'Casper Dash' },
	]);
	expect(getTransfersDeploy('CDAS')({})).toEqual([]);
});

test('getPendingTransferDeployHash should call createSelector', () => {
	const state = { deploys: { transfers: [{ symbol: 'CDAS', deployHash: 'testhash', status: 'pending' }] } };

	expect(getPendingTransferDeployHash('CDAS')(state)).toEqual(['testhash']);
});
