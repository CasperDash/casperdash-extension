import { useCallback } from 'react';
import { User } from 'casper-storage';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';
import { onBindingAuthInfo } from '@cd/actions/userActions';

const useWelcomeBack = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onAuthCredentialSuccess = useCallback(
		(result) => {
			const { publicKey, user } = result;

			dispatch(onBindingAuthInfo(publicKey, user));
			navigate('/');
		},
		[dispatch, navigate],
	);

	// This is used for creating new Uint8Array instance
	const convertSaltInfo = useCallback((salt) => {
		const saltInfo = Object.keys(salt).map((key) => salt[key]);
		return new Uint8Array(saltInfo);
	}, []);

	const validateUserCredential = useCallback(
		async (password) => {
			if (!password) {
				return undefined;
			}

			try {
				const cacheConnectedAccount = await getConnectedAccountChromeLocalStorage();
				const { loginOptions: { userHashingOptions, userInfo: encryptedUserInfo } } = cacheConnectedAccount;

				// Get encrypted info from Localstorage
				const encryptedHashingOptions = JSON.parse(userHashingOptions);

				// Convert salt info from object to Array
				// This is used for creating new Uint8Array instance
				const userLoginOptions = {
					...encryptedHashingOptions,
					salt: convertSaltInfo(encryptedHashingOptions.salt),
				};
				// Deserialize user info to an instance of User
				const user = User.deserializeFrom(password, encryptedUserInfo, {
					passwordOptions: userLoginOptions,
				});

				const wallet = await user.getWalletAccount(0);
				const publicKey = await wallet.getPublicAddress();

				// Similar to useCreateUser
				return {
					publicKey,
					user: {
						userHashingOptions: userLoginOptions,
						userInfo: encryptedUserInfo,
					},
				};
			} catch (err) {
				console.error(`🚀 ~ >> ~ err`, err);
				return undefined;
			}
		},
		[convertSaltInfo],
	);

	return { validateUserCredential, onAuthCredentialSuccess };
};

export default useWelcomeBack;
