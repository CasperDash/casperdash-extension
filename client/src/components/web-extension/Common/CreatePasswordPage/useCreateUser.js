import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { onBindingAuthInfo } from '@cd/actions/userActions';
import { resetWalletCreation } from '@cd/actions/createWalletActions';
import { selectCreateWalletEncryptionType, selectCreateWalletKeyphrase } from '@cd/selectors/createWallet';
import { createUserServiceSW } from '@cd/components/hooks/useServiceWorker';
import { sharesToMnemonic } from '@cd/helpers/shareable';

const useCreateUser = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const keyPhraseShares = useSelector(selectCreateWalletKeyphrase);
	const encryptionType = useSelector(selectCreateWalletEncryptionType);


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
				if (!keyPhraseShares) {
					throw new Error('Missing keyphrase');
				}

				const result = await createUserServiceSW(password, sharesToMnemonic(keyPhraseShares), encryptionType);
				onCreateSuccess(result);
				return result;
			} catch (err) {
				console.error(`🚀 ~ useCreateUser ~ err`, err);
				return undefined;
			}
		},
		[keyPhraseShares, onCreateSuccess, encryptionType],
	);

	return { onCreateNewUser };
};

export default useCreateUser;
