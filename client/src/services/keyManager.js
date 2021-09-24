import {
	getKeyWeightDeploy,
	buildContractInstallDeploy,
	getDeploymentThresholdDeploy,
	signDeploy,
} from './casperServices';
import { CLPublicKey, DeployUtil } from 'casper-js-sdk';
import { request } from './request';

export const getAccountWeightDeploy = async (weight, mainAccount, secondAccount) => {
	try {
		const setAccount = secondAccount || mainAccount;
		const mainAccountPK = CLPublicKey.fromHex(mainAccount);
		const secondAccountPK = CLPublicKey.fromHex(setAccount);
		const deploy = getKeyWeightDeploy(mainAccountPK, secondAccountPK, weight);
		const signedDeploy = await signDeploy(deploy, mainAccount, setAccount);
		return signedDeploy;
	} catch (error) {
		return { error: { message: error.message } };
	}
};

export const getAccountDeploymentDeploy = async (weight, mainAccount) => {
	try {
		const mainAccountPK = CLPublicKey.fromHex(mainAccount);
		const deploy = getDeploymentThresholdDeploy(mainAccountPK, weight);
		const signedDeploy = await signDeploy(deploy, mainAccount, mainAccount);
		return signedDeploy;
	} catch (error) {
		return { error: { message: error.message } };
	}
};

const getKeyManagerDeploySession = async () => {
	const data = await request('/getKeyManagerDeploySession');
	return data;
};

export const getKeyManagerContractDeploy = async (mainAccount) => {
	try {
		const mainAccountPK = CLPublicKey.fromHex(mainAccount);
		const deploySession = await getKeyManagerDeploySession();
		const deployFromJson = DeployUtil.deployFromJson(deploySession);
		const deploy = await buildContractInstallDeploy(mainAccountPK, deployFromJson.val.session);
		const signedDeploy = await signDeploy(deploy, mainAccount, mainAccount);
		delete signedDeploy.deploy.session;
		return signedDeploy;
	} catch (error) {
		return { error: { message: error.message } };
	}
};
