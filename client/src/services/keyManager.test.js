import * as casper from 'casper-js-sdk';
import * as keyManager from './keyManager';
import * as casperServices from './casperServices';
import * as request from './request';

const spyOnDeployParams = jest.spyOn(casper.DeployUtil, 'DeployParams');
const spyFromMap = jest.spyOn(casper.RuntimeArgs, 'fromMap');
const spyOnNewStoredContractByName = jest.spyOn(casper.DeployUtil.ExecutableDeployItem, 'newStoredContractByName');
const spyStandardPayment = jest.spyOn(casper.DeployUtil, 'standardPayment');
const spyMakeDeploy = jest.spyOn(casper.DeployUtil, 'makeDeploy');
const spySignDeploy = jest.spyOn(casperServices, 'signDeploy');
const spyDeployFromJson = jest.spyOn(casper.DeployUtil, 'deployFromJson');

test('buildKeyManagerDeploy', () => {
	const pk = casper.CLPublicKey.fromHex('0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad');
	keyManager.buildKeyManagerDeploy(pk, 'test', {}, 10);
	expect(spyOnDeployParams).toHaveBeenCalled();
	expect(spyFromMap).toHaveBeenCalled();
	expect(spyOnNewStoredContractByName).toHaveBeenCalled();
	expect(spyStandardPayment).toHaveBeenCalled();
	expect(spyMakeDeploy).toHaveBeenCalled();
});

test('getKeyWeightDeploy', () => {
	const pk = casper.CLPublicKey.fromHex('0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad');
	expect(Object.keys(keyManager.getKeyWeightDeploy(pk, pk, 2, 1000000))).toEqual([
		'approvals',
		'session',
		'payment',
		'header',
		'hash',
	]);
});

test('getDeploymentThresholdDeploy', () => {
	const pk = casper.CLPublicKey.fromHex('0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad');
	expect(Object.keys(keyManager.getDeploymentThresholdDeploy(pk, 2, 1000000))).toEqual([
		'approvals',
		'session',
		'payment',
		'header',
		'hash',
	]);
});

test('getKeyManagementThresholdDeploy', () => {
	const pk = casper.CLPublicKey.fromHex('0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad');
	expect(Object.keys(keyManager.getKeyManagementThresholdDeploy(pk, 2, 1000000))).toEqual([
		'approvals',
		'session',
		'payment',
		'header',
		'hash',
	]);
});

test('getSignedAccountWeightDeploy', async () => {
	keyManager.getSignedAccountWeightDeploy(2, '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad');
	expect(spySignDeploy).toHaveBeenCalled();
});

test('getSignedAccountWeightDeploy return error', async () => {
	const value = await keyManager.getSignedAccountWeightDeploy(
		2,
		'0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad',
		'test',
	);
	expect(Boolean(value.error)).toBe(true);
});

test('getSignedAccountDeploymentDeploy', async () => {
	await keyManager.getSignedAccountDeploymentDeploy(
		2,
		'0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad',
	);
	expect(spySignDeploy).toHaveBeenCalled();
});

test('getSignedAccountDeploymentDeploy return error', async () => {
	const value = await keyManager.getSignedAccountDeploymentDeploy(2, 'test');
	expect(Boolean(value.error)).toBe(true);
});

test('getSignedKeyManagementThresholdDeploy', async () => {
	await keyManager.getSignedKeyManagementThresholdDeploy(
		2,
		'0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad',
	);
	expect(spySignDeploy).toHaveBeenCalled();
});

test('getSignedKeyManagementThresholdDeploy return error', async () => {
	const value = await keyManager.getSignedKeyManagementThresholdDeploy(2, 'test');
	expect(Boolean(value.error)).toBe(true);
});

test('getKeyManagerContractDeploy', async () => {
	const spyOnRequest = jest.spyOn(request, 'request');
	spyOnRequest.mockReturnValue({});
	await keyManager.getKeyManagerContractDeploy('0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad');
	expect(spySignDeploy).toHaveBeenCalled();
	expect(spyOnRequest).toHaveBeenCalled();
	expect(spyDeployFromJson).toHaveBeenCalled();
});

test('getKeyManagerContractDeploy return error', async () => {
	const value = await keyManager.getKeyManagerContractDeploy('test');
	expect(Boolean(value.error)).toBe(true);
});
