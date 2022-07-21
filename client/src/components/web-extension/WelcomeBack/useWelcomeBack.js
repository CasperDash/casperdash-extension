import { useCallback } from 'react';
import { User } from 'casper-storage';
import { onGetUserHashingOptions, onGetUserInfo } from '@cd/web-extension/CreateWallet/wallet/storage';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPublicKey } from "@cd/actions/userActions";

const useWelcomeBack = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onAuthCredentialSuccess = useCallback((publicKey) => {
    dispatch(setPublicKey(publicKey));
		navigate('/');
  }, [dispatch, navigate]);

	// This is used for creating new Uint8Array instance
	const convertSaltInfo = useCallback((salt) => {
		const saltInfo = Object.keys(salt).map((key) => salt[key]);
		return new Uint8Array(saltInfo);
	}, []);

	const validateUserCredential = useCallback(async (password) => {
		if (!password) {
			return undefined;
		}

		try {
			// Get encrypted info from Localstorage
			const encryptedHashingOptions = JSON.parse(await onGetUserHashingOptions());
			const encryptedUserInfo = await onGetUserInfo();

			console.log(`🚀 ~ >> ~ encryptedHashingOptions`, encryptedHashingOptions);
			console.log(`🚀 ~ >> ~ encryptedUserInfo`, encryptedUserInfo);

			// Convert salt info from object to Array
			// This is used for creating new Uint8Array instance
			const newSalt = convertSaltInfo(encryptedHashingOptions.salt);
      console.log(`🚀 ~ file: useWelcomeBack.jsx ~ line 40 ~ validateUserCredential ~ newSalt`, newSalt)

			// Deserialize user info to an instance of User
			const user = User.deserializeFrom(password, encryptedUserInfo, {
				passwordOptions: {
					...encryptedHashingOptions,
					salt: newSalt,
				},
			});
			console.log(`🚀 ~ >> ~ user: `, user);

			const masterKey = user.getHDWallet();
			console.log(`🚀 ~ >> ~ masterKey`, masterKey);

			const wallet = await user.getWalletAccount(0);
			console.log(`🚀 ~ >> ~ wallet`, wallet);

			const publicKey = await wallet.getPublicKey();
			console.log(`🚀 ~ >> ~ publicKey`, publicKey);

      return { publicKey }
		} catch (err) {
			console.log(`🚀 ~ >> ~ err`, err);
      return undefined;
		}
	}, [convertSaltInfo]);

	return { validateUserCredential, onAuthCredentialSuccess };
};

export default useWelcomeBack;
