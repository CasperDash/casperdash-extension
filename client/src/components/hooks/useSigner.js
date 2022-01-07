import { useSelector } from 'react-redux';
import { CONNECTION_TYPES } from '../../constants/settings';
import { getLoginOptions } from '../../selectors/user';
import { signDeployByCasperSigner } from '../../services/casperServices';
import { signDeployByLedger } from '../../services/ledgerServices';
import useLedger from './useLedger';

const useSigner = () => {
	const loginOptions = useSelector(getLoginOptions);
	const { handleConnectLedger } = useLedger();

	const signByLedger = async (deploy, mainAccountHex) => {
		let options = loginOptions;
		if (!options.casperApp) {
			options = await handleConnectLedger();
		}
		return await signDeployByLedger(deploy, {
			publicKey: mainAccountHex,
			app: options.casperApp,
			keyPath: options.keyPath,
		});
	};

	const signByCasperSinger = async (deploy, mainAccountHex, setAccountHex) => {
		return await signDeployByCasperSigner(deploy, mainAccountHex, setAccountHex);
	};

	const sign = (deploy, mainAccountHex, setAccountHex) => {
		switch (loginOptions.connectionType) {
			case CONNECTION_TYPES.ledger:
				return signByLedger(deploy, mainAccountHex);
			case CONNECTION_TYPES.casperSigner:
				return signByCasperSinger(deploy, mainAccountHex, setAccountHex);
			default:
				throw Error('Can not find signer');
		}
	};

	return { sign };
};

export default useSigner;
