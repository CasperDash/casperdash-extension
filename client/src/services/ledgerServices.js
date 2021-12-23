import { DeployUtil, CLPublicKey } from 'casper-js-sdk';

export const signByLedger = async (deployObj, options = {}) => {
	const responseDeploy = await options.app.sign(
		`m/44'/506'/0'/0/${options.keyPath}`,
		DeployUtil.deployToBytes(deployObj),
	);

	if (!responseDeploy.signatureRS) {
		throw new Error(responseDeploy.errorMessage);
	}

	let signedDeploy = DeployUtil.setSignature(
		deployObj,
		responseDeploy.signatureRS,
		CLPublicKey.fromHex(options.publicKey),
	);
	signedDeploy = DeployUtil.validateDeploy(signedDeploy);
	if (signedDeploy.ok) {
		return signedDeploy.val;
	} else {
		throw new Error(signedDeploy.val);
	}
};
