import { setKeyWeightDeploy } from './casperServices';
import { Signer, CLPublicKey } from 'casper-js-sdk';

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
