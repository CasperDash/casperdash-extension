import { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { onBindingAuthInfo } from '@cd/actions/userActions';
import { resetWalletCreation } from '@cd/actions/createWalletActions';
import { selectCreateWalletEncryptionType, selectCreateWalletKeyphrase } from '@cd/selectors/createWallet';
import { createUserServiceSW } from '@cd/components/hooks/useServiceWorker';

const useCreateUser = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const keyphraseRef = useRef(useSelector(selectCreateWalletKeyphrase));
	const encryptionType = useSelector(selectCreateWalletEncryptionType);

	useEffect(() => {
		return () => {
			keyphraseRef.current = '';
		};
	}, []);

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
				if (!keyphraseRef?.current) {
					throw new Error('Missing keyphrase');
				}

				const result = await createUserServiceSW(password, keyphraseRef.current, encryptionType);
				onCreateSuccess(result);
				return result;
			} catch (err) {
				console.error(`🚀 ~ useCreateUser ~ err`, err);
				return undefined;
			}
		},
		[keyphraseRef, onCreateSuccess, encryptionType],
	);

	return { onCreateNewUser };
};

export default useCreateUser;
