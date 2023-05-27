import { useSelector } from 'react-redux';
import { CONNECTION_TYPES } from '@cd/constants/settings';
import { getLoginOptions } from '@cd/selectors/user';
import { signDeployByCasperSigner } from '@cd/services/casperServices';
import { signDeployByLedger } from '@cd/services/ledgerServices';
import { signDeployByPrivateKey } from '@cd/services/privateKeyServices';

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
			case CONNECTION_TYPES.privateKey:
				return signDeployByPrivateKey(deploy, mainAccountHex, setAccountHex);
			default:
				throw Error('Can not find signer');
		}
	};

	return { sign };
};

export default useSigner;
