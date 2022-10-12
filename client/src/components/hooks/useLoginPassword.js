import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { onBindingAuthInfo } from '@cd/actions/userActions';
import { validateReturningUserSW } from '@cd/hooks/useServiceWorker';

const useLoginPassword = () => {
	const dispatch = useDispatch();
	// const [] = useAuthLogin();

	const onAuthCredentialSuccess = useCallback(
		(result) => {
			const { publicKey, userDetails } = result;
			dispatch(onBindingAuthInfo({ publicKey, user: userDetails }));
		},
		[dispatch],
	);

	const validateUserCredential = useCallback(async (password) => {
		if (!password) {
			return undefined;
		}

		try {
			const result = await validateReturningUserSW(password);

			// Similar to useCreateUser
			return result;
		} catch (err) {
			console.error(`🚀 ~ >> ~ err`, err);
			return undefined;
		}
	}, []);

	return { validateUserCredential, onAuthCredentialSuccess };
};

export default useLoginPassword;
