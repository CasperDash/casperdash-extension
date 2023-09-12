import { CLPublicKey, DeployUtil, Signer } from 'casper-js-sdk';
import {
	buildTransferDeploy,
	buildContractInstallDeploy,
	signDeployByCasperSigner,
	buildTransferTokenDeploy,
	connectCasperSigner,
} from './casperServices';

test('getTransferDeploy', () => {
	const spyOnDeployParams = jest.spyOn(DeployUtil, 'DeployParams');
	const spyOnNewTransfer = jest.spyOn(DeployUtil.ExecutableDeployItem, 'newTransfer');
	const spyOnPayment = jest.spyOn(DeployUtil, 'standardPayment');
	const spyOnMakeDeploy = jest.spyOn(DeployUtil, 'makeDeploy');
	const deploy = buildTransferDeploy(
		CLPublicKey.fromHex('0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad'),
		CLPublicKey.fromHex('0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad'),
		1000000000,
		0,
		10,
		'casper-test',
	);
	expect(spyOnDeployParams).toHaveBeenCalled();
	expect(spyOnNewTransfer).toHaveBeenCalled();
	expect(spyOnPayment).toHaveBeenCalled();
	expect(spyOnMakeDeploy).toHaveBeenCalled();
	expect(Object.keys(deploy)).toEqual(['approvals', 'session', 'payment', 'header', 'hash']);
});

test('buildContractInstallDeploy', () => {
	const spyOnDeployParams = jest.spyOn(DeployUtil, 'DeployParams');
	const spyOnPayment = jest.spyOn(DeployUtil, 'standardPayment');
	try {
		buildContractInstallDeploy(
			CLPublicKey.fromHex('0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad'),
			{},
		);
	} catch {
		expect(spyOnPayment).toHaveBeenCalled();
		expect(spyOnDeployParams).toHaveBeenCalled();
	}
});

test('signDeployByCasperSigner', async () => {
	const deploy = buildTransferTokenDeploy(
		CLPublicKey.fromHex('0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad'),
		CLPublicKey.fromHex('0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad'),
		1000000000,
		'123123123',
		10,
	);
	const spyOnDeployToJson = jest.spyOn(DeployUtil, 'deployToJson');
	const spyOnSign = jest.spyOn(Signer, 'sign');
	spyOnSign.mockImplementation(() => 'signed');
	const signed = await signDeployByCasperSigner(
		deploy,
		'0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad',
		'0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad',
	);
	expect(spyOnDeployToJson).toHaveBeenCalled();
	expect(spyOnSign).toHaveBeenCalled();
	expect(signed).toBe('signed');
});

test('getTransferTokenDeploy', async () => {
	const spyOnDeployParams = jest.spyOn(DeployUtil, 'DeployParams');
	const spyOnNewStoredContractByHash = jest.spyOn(DeployUtil.ExecutableDeployItem, 'newStoredContractByHash');
	const spyOnPayment = jest.spyOn(DeployUtil, 'standardPayment');
	const spyOnMakeDeploy = jest.spyOn(DeployUtil, 'makeDeploy');
	const deploy = await buildTransferTokenDeploy(
		CLPublicKey.fromHex('0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad'),
		CLPublicKey.fromHex('0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad'),
		1000,
		'test',
		'100',
	);
	expect(spyOnDeployParams).toHaveBeenCalled();
	expect(spyOnNewStoredContractByHash).toHaveBeenCalled();
	expect(spyOnPayment).toHaveBeenCalled();
	expect(spyOnMakeDeploy).toHaveBeenCalled();
	expect(Object.keys(deploy)).toEqual(['approvals', 'session', 'payment', 'header', 'hash']);
});

test('Should request to connect with signer', async () => {
	const spyOnSendConnectionRequest = jest.spyOn(Signer, 'sendConnectionRequest');
	spyOnSendConnectionRequest.mockImplementation(() => {});
	connectCasperSigner();
	expect(spyOnSendConnectionRequest).toHaveBeenCalled();
});

test('Should return error if have issue when connecting', async () => {
	const spyOnSendConnectionRequest = jest.spyOn(Signer, 'sendConnectionRequest');
	spyOnSendConnectionRequest.mockImplementation(() => {
		throw 'error';
	});
	let message;
	try {
		message = connectCasperSigner();
	} catch {
		expect(message).toBe('error');
		expect(spyOnSendConnectionRequest).toHaveBeenCalled();
	}
});
