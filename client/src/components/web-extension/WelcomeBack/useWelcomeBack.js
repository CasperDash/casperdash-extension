import { useCallback } from 'react';
import { User } from 'casper-storage';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPublicKey } from "@cd/actions/userActions";
import { getConnectedAccountLocalStorage } from '@cd/actions/userActions';
import { getLoginOptions } from "@cd/selectors/user";

const useWelcomeBack = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /**
   * Without `Locking` account,
   * This data is lost when extension is closed
   */
  const loginOptionsStore = useSelector(getLoginOptions);

  console.log(`🚀 ~ useWelcomeBack ~ loginOptionsStore`, loginOptionsStore)

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
      const cacheConnectedAccount = getConnectedAccountLocalStorage();
      console.log(`🚀 ~ validateUserCredential ~ cacheConnectedAccount`, cacheConnectedAccount)
      const { loginOptions } = cacheConnectedAccount;
			// Get encrypted info from Localstorage
			const encryptedHashingOptions = JSON.parse(loginOptions.userHashingOptions);
			const encryptedUserInfo = loginOptionsStore.userInfo;

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

			const wallet = await user.getWalletAccount(0);
			const publicKey = await wallet.getPublicKey();

      return { publicKey }
		} catch (err) {
			console.log(`🚀 ~ >> ~ err`, err);
      return undefined;
		}
	}, [convertSaltInfo, loginOptionsStore.userInfo]);

	return { validateUserCredential, onAuthCredentialSuccess };
};

export default useWelcomeBack;
