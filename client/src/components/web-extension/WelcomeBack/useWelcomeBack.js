import { useCallback } from 'react';
import { User } from 'casper-storage';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';
import { onBindingAuthInfo } from '@cd/actions/userActions';
import UserInstance from '@cd/services/UserService';
import { validateReturningUser } from "@cd/hooks/useServiceWorker";

const useWelcomeBack = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onAuthCredentialSuccess = useCallback(
		(result) => {
			const { publicKey } = result;

			// UserInstance.instance = userInstance;
			dispatch(onBindingAuthInfo(publicKey));
			navigate('/');
		},
		[dispatch, navigate],
	);

	// This is used for creating new Uint8Array instance
	// const convertSaltInfo = useCallback((salt) => {
	// 	const saltInfo = Object.keys(salt).map((key) => salt[key]);
	// 	return new Uint8Array(saltInfo);
	// }, []);

	const validateUserCredential = useCallback(
		async (password) => {
			if (!password) {
				return undefined;
			}

			try {
				// const cacheConnectedAccount = await getConnectedAccountChromeLocalStorage();
				// const {
				// 	loginOptions: { userHashingOptions, userInfo: encryptedUserInfo },
				// } = cacheConnectedAccount;

				// // Get encrypted info from Localstorage
				// const encryptedHashingOptions = JSON.parse(userHashingOptions);

				// // Convert salt info from object to Array
				// // This is used for creating new Uint8Array instance
				// const userLoginOptions = {
				// 	...encryptedHashingOptions,
				// 	salt: convertSaltInfo(encryptedHashingOptions.salt),
				// };
				// // Deserialize user info to an instance of User
				// const user = User.deserializeFrom(password, encryptedUserInfo, {
				// 	passwordOptions: userLoginOptions,
				// });

				// const currentWalletIndex = 0;
				// const wallet = await user.getWalletAccount(currentWalletIndex);
				// const publicKey = await wallet.getPublicKey();

				const publicKey = await validateReturningUser(password);
        console.log(`🚀 ~ publicKey`, publicKey)

				// Similar to useCreateUser
				return {
					publicKey,
				};
			} catch (err) {
				console.error(`🚀 ~ >> ~ err`, err);
				return undefined;
			}
		},
		[],
	);

	return { validateUserCredential, onAuthCredentialSuccess };
};

export default useWelcomeBack;
