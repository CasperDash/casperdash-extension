import { request } from './request';
import { setKeyWeightDeploy, putDeploy, printAccount } from './casperServices';
import { Signer, CLPublicKey } from 'casper-js-sdk';

export const getKeyManagerData = async (publicKey) => {
	if (!publicKey) {
		return {};
	}

	const data = await request(`keyManager/${publicKey}`);

	return data;
};

export const getWeightDeploy = async (weight, mainAccount, secondAccount) => {
	if (!mainAccount || !weight) {
		return {};
	}
	const deploy = await request(
		`keyManager/weight/getDeploy?mainAccount=${mainAccount}&secondAccount=${secondAccount}&weight=${weight}`,
	);
	return deploy;
};

export const setKeyWeight = async (weight, mainAccount, secondAccount) => {
	const setAccount = secondAccount || mainAccount;
	const mainAccountPK = CLPublicKey.fromHex(mainAccount);
	const secondAccountPK = CLPublicKey.fromHex(setAccount);
	const deploy = setKeyWeightDeploy(mainAccountPK, secondAccountPK, weight);
	console.log({ deploy: { ...deploy } });
	const signedDeploy = await Signer.sign({ deploy: { ...deploy } }, mainAccount, setAccount);
	// await putDeploy(signedDeploy);
	// await printAccount(mainAccount);
};
