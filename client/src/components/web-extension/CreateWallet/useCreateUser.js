import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { onBindingAuthInfo } from '@cd/actions/userActions';
import { resetWalletCreation } from '@cd/actions/createWalletActions';
import { selectCreateWalletKeyphrase } from '@cd/selectors/createWallet';
import { createUserServiceSW } from '@cd/components/hooks/useServiceWorker';

const useCreateUser = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const keyphrase = useSelector(selectCreateWalletKeyphrase);
	const onCreateSuccess = useCallback(
		(result) => {
			const { publicKey, userDetails } = result;
			const onCompleted = () => navigate('/');
			dispatch(onBindingAuthInfo({ publicKey, user: userDetails }, onCompleted));
			dispatch(resetWalletCreation());

			return result;
		},
		[dispatch, navigate],
	);

	const onCreateNewUser = useCallback(
		async (password) => {
			try {
				if (!keyphrase) {
					throw new Error('Missing keyphrase');
				}

				const result = await createUserServiceSW(password, keyphrase);
				onCreateSuccess(result);
				return result;
			} catch (err) {
				console.error(`🚀 ~ useCreateUser ~ err`, err);
				return undefined;
			}
		},
		[keyphrase, onCreateSuccess],
	);

	return { onCreateNewUser };
};

export default useCreateUser;
