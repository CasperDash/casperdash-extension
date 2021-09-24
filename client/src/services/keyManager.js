import { setKeyWeightDeploy, buildContractInstallDeploy, putDeploy } from './casperServices';
import { Signer, CLPublicKey, DeployUtil } from 'casper-js-sdk';
import { request } from './request';

export const getAccountWeightDeploy = async (weight, mainAccount, secondAccount) => {
	try {
		const setAccount = secondAccount || mainAccount;
		const mainAccountPK = CLPublicKey.fromHex(mainAccount);
		const secondAccountPK = CLPublicKey.fromHex(setAccount);
		const deploy = setKeyWeightDeploy(mainAccountPK, secondAccountPK, weight);
		const deployObj = DeployUtil.deployToJson(deploy);
		const signedDeploy = await Signer.sign(deployObj, mainAccount, setAccount);
		console.log(signedDeploy);
		return signedDeploy;
	} catch (error) {
		return { error: { message: error.message } };
	}
};

const getKeyManagerDeploySession = async () => {
	const data = await request('/getKeyManagerDeploySession');
	console.log('session response', data);
	return data;
};

export const getKeyManagerContractDeploy = async (mainAccount) => {
	try {
		const mainAccountPK = CLPublicKey.fromHex(mainAccount);
		const deploySession = await getKeyManagerDeploySession();
		const deployFromJson = DeployUtil.deployFromJson(deploySession);
		const deploy = await buildContractInstallDeploy(mainAccountPK, deployFromJson.val.session);
		const deployObj = DeployUtil.deployToJson(deploy);
		const signedDeploy = await Signer.sign(deployObj, mainAccount, mainAccount);
		//const dpO = DeployUtil.deployFromJson(signedDeploy);
		//await putDeploy(dpO.val);
		delete signedDeploy.deploy.session;
		console.log(signedDeploy);
		return signedDeploy;
	} catch (error) {
		return { error: { message: error.message } };
	}
};
