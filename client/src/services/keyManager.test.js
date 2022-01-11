import * as casper from 'casper-js-sdk';
import * as keyManager from './keyManager';
import * as request from './request';

const spyOnDeployParams = jest.spyOn(casper.DeployUtil, 'DeployParams');
const spyFromMap = jest.spyOn(casper.RuntimeArgs, 'fromMap');
const spyOnNewStoredContractByName = jest.spyOn(casper.DeployUtil.ExecutableDeployItem, 'newStoredContractByName');
const spyStandardPayment = jest.spyOn(casper.DeployUtil, 'standardPayment');
const spyMakeDeploy = jest.spyOn(casper.DeployUtil, 'makeDeploy');
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

test('buildAccountWeightDeploy return error', async () => {
	try {
		keyManager.buildAccountWeightDeploy(
			2,
			'0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad',
			'test',
		);
	} catch (error) {
		expect(error.message).toBe('Error on build set account weight deploy');
	}
});

test('buildAccountDeploymentDeploy return error', async () => {
	try {
		keyManager.buildAccountDeploymentDeploy(2, 'test');
	} catch (error) {
		expect(error.message).toBe('Error on build set account deployment deploy');
	}
});

test('buildKeyManagementThresholdDeploy return error', async () => {
	try {
		keyManager.buildKeyManagementThresholdDeploy(2, 'test');
	} catch (error) {
		expect(error.message).toBe('Error on build set account threshold deploy');
	}
});

test('getKeyManagerContractDeploy return error', async () => {
	try {
		await keyManager.getKeyManagerContractDeploy('test');
	} catch (error) {
		expect(error.message).toBe('Error on build set key manager contract deploy');
	}
});
