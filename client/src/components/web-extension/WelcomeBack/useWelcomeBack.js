import { useCallback } from 'react';
import { User } from 'casper-storage';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { onBindingAuthInfo, getConnectedAccountLocalStorage } from '@cd/actions/userActions';
import { getLoginOptions } from '@cd/selectors/user';

const useWelcomeBack = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	/**
	 * Without `Locking` account,
	 * This data is lost when extension is closed
	 */
	const loginOptionsStore = useSelector(getLoginOptions);
	console.log(`🚀 ~ useWelcomeBack ~ loginOptionsStore`, loginOptionsStore);

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
				const cacheConnectedAccount = getConnectedAccountLocalStorage();
				console.log(`🚀 ~ cacheConnectedAccount`, cacheConnectedAccount);
				const { loginOptions } = cacheConnectedAccount;

				// Get encrypted info from Localstorage
				const encryptedHashingOptions =
					typeof loginOptions.userHashingOptions === 'string'
						? JSON.parse(loginOptions.userHashingOptions)
						: loginOptions.userHashingOptions;
				const encryptedUserInfo = loginOptionsStore.userInfo;

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
				const publicKey = await wallet.getPublicKey();

				// Similar to useCreateUser
				return {
					publicKey,
					user: {
						userHashingOptions: userLoginOptions,
						userInfo: encryptedUserInfo,
					},
				};
			} catch (err) {
				console.log(`🚀 ~ >> ~ err`, err);
				return undefined;
			}
		},
		[convertSaltInfo, loginOptionsStore.userInfo],
	);

	return { validateUserCredential, onAuthCredentialSuccess };
};

export default useWelcomeBack;
