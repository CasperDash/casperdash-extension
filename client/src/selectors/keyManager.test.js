import { getMutationSelector, getQuerySelector } from '@redux-requests/core';
import {
	keyManagerDetailsSelector,
	deploySelector,
	isKeyManagerContractAvailable,
	getPendingDeploys,
	getPendingDeployHashes,
} from './keyManager';

jest.mock('@redux-requests/core', () => {
	return {
		getMutationSelector: jest.fn().mockReturnValue(() => ({ data: { namedKeys: [{ hash: 'test' }] } })),
		getQuerySelector: jest.fn().mockReturnValue(() => ({ data: {} })),
	};
});

test('keyManagerDetailsSelector should call getQuerySelector', () => {
	keyManagerDetailsSelector;
	expect(getQuerySelector).toHaveBeenCalled();
});

test('deploySelector should call getMutationSelector', () => {
	deploySelector;
	expect(getMutationSelector).toHaveBeenCalled();
});

test('isKeyManagerContractAvailable', () => {
	const isAvailable = isKeyManagerContractAvailable({});
	expect(isAvailable).toBe(false);
});

test('getPendingDeploys', () => {
	const pendingDeploys = getPendingDeploys({ keysManager: { deploys: [{ status: 'pending' }] } });
	expect(pendingDeploys).toEqual({ 0: [] });
});

test('getPendingDeploys return empty', () => {
	const pendingDeploys = getPendingDeploys({});
	expect(pendingDeploys).toEqual({});
});

test('getPendingDeployHashes return empty', () => {
	let pendingDeploysHashes = getPendingDeployHashes({});
	expect(pendingDeploysHashes).toEqual([]);
	pendingDeploysHashes = getPendingDeployHashes({
		keysManager: { deploys: { weight: [{ status: 'success', hash: 'test' }] } },
	});
	expect(pendingDeploysHashes).toEqual([]);
});

test('getPendingDeployHashes return value', () => {
	const pendingDeploysHashes = getPendingDeployHashes({
		keysManager: { deploys: { weight: [{ status: 'pending', hash: 'test' }] } },
	});
	expect(pendingDeploysHashes).toEqual(['test']);
});
