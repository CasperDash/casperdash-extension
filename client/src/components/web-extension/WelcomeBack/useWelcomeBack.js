import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { onBindingAuthInfo } from '@cd/actions/userActions';
import { validateReturningUserSW } from '@cd/hooks/useServiceWorker';

const useWelcomeBack = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onAuthCredentialSuccess = useCallback(
		(result) => {
			const { publicKey, userDetails } = result;
			const onCompleted = () => navigate('/');
			dispatch(onBindingAuthInfo({ publicKey, user: userDetails }, onCompleted));
		},
		[dispatch, navigate],
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

export default useWelcomeBack;
