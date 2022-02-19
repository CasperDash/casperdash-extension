import { useSelector } from 'react-redux';
import { CONNECTION_TYPES } from '../../constants/settings';
import { getLoginOptions } from '../../selectors/user';
import { signDeployByCasperSigner } from '../../services/casperServices';
import { signDeployByLedger } from '../../services/ledgerServices';

/**
 * Use the signer specified in the login options to sign a deploy.
 * @returns The signed deploy is being returned.
 */
const useSigner = () => {
	const loginOptions = useSelector(getLoginOptions);

	const sign = async (deploy, mainAccountHex, setAccountHex) => {
		switch (loginOptions.connectionType) {
			case CONNECTION_TYPES.ledger: {
				return await signDeployByLedger(deploy, {
					publicKey: mainAccountHex,
					keyIndex: loginOptions.keyIndex,
				});
			}
			case CONNECTION_TYPES.casperSigner:
				return await signDeployByCasperSigner(deploy, mainAccountHex, setAccountHex);
			default:
				throw Error('Can not find signer');
		}
	};

	return { sign };
};

export default useSigner;
