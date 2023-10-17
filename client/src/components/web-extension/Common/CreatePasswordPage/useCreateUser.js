import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { onBindingAuthInfo } from '@cd/actions/userActions';
import { resetWalletCreation } from '@cd/actions/createWalletActions';
import {
	selectCreateWalletEncryptionType,
	selectCreateWalletKeyphrase,
	selectCreateWalletDerivationPath,
} from '@cd/selectors/createWallet';
import { createUserServiceSW } from '@cd/components/hooks/useServiceWorker';
import { ERRORS } from '@cd/constants/errors';

const useCreateUser = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const keyPhrase = useSelector(selectCreateWalletKeyphrase);
	const encryptionType = useSelector(selectCreateWalletEncryptionType);
	const derivationPath = useSelector(selectCreateWalletDerivationPath);

	const onCreateSuccess = useCallback(
		(result) => {
			const { publicKey, userDetails } = result;
			const onCompleted = () => navigate('/');
			dispatch(onBindingAuthInfo({ publicKey, user: userDetails }, onCompleted));
			// Reset the wallet creation state.
			dispatch(resetWalletCreation());

			return result;
		},
		[dispatch, navigate],
	);

	const onCreateNewUser = useCallback(
		async (password) => {
			try {
				if (!keyPhrase) {
					throw new Error(ERRORS.MISSING_KEYPHRASE);
				}

				const result = await createUserServiceSW(password, keyPhrase, encryptionType, derivationPath);
				onCreateSuccess(result);
				return result;
			} catch (err) {
				console.error(`🚀 ~ useCreateUser ~ err`, err);
				return undefined;
			}
		},
		[keyPhrase, onCreateSuccess, encryptionType, derivationPath],
	);

	return { onCreateNewUser };
};

export default useCreateUser;
