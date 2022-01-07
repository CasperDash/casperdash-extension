import { useSelector } from 'react-redux';
import { CONNECTION_TYPES } from '../../constants/settings';
import { getConnectionType } from '../../selectors/user';
import { signDeployByCasperSigner, signDeployByLedger } from '../../services/casperServices';
import useLedger from './useLedger';

const useSigner = () => {
	const connectionType = useSelector(getConnectionType);
	const { ledgerOptions, handleConnectLedger } = useLedger();

	const signByLedger = async (deploy, mainAccountHex) => {
		let options = ledgerOptions;
		if (!options.casperApp) {
			options = await handleConnectLedger();
		}
		return await signDeployByLedger(deploy, mainAccountHex, options);
	};

	const signByCasperSinger = async (deploy, mainAccountHex, setAccountHex) => {
		return await signDeployByCasperSigner(deploy, mainAccountHex, setAccountHex);
	};

	const sign = (deploy, mainAccountHex, setAccountHex) => {
		switch (connectionType) {
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
