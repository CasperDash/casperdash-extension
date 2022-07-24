import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { WalletDescriptor, User, EncryptionType } from 'casper-storage';
import { onBindingAuthInfo } from '@cd/actions/userActions';
import { resetWalletCreation } from "@cd/actions/createWalletActions";
import { selectCreateWalletKeyphrase } from '@cd/selectors/createWallet';

const encryptionType = EncryptionType.Ed25519;
const useCreateUser = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const keyphrase = useSelector(selectCreateWalletKeyphrase);
	const onCreateSuccess = useCallback(
		(result) => {
			const { publicKey, user } = result;
			dispatch(onBindingAuthInfo(publicKey, user));
      dispatch(resetWalletCreation());
			navigate('/');
			return result;
		},
		[dispatch, navigate],
	);

	const onGetUserInfoHash = useCallback(async (user) => {
		// Take the hashing options from user's instance
		const hashingOptions = user.getPasswordHashingOptions();
		const userHashingOptions = JSON.stringify(hashingOptions);

		// Serialize user information to a secure encrypted string
		const userInfo = user.serialize();

		return {
			userHashingOptions,
			userInfo,
		};
	}, []);

  /**
   * Init new User account.
   * Aim to return publicKey and User info, including hash info and User info
   */
	const onInitNewUserHandler = useCallback(
		async (user) => {
      // Get basic User info
			const result = await onGetUserInfoHash(user);

			// Create Wallet and get public key
			const wallet = await user.addWalletAccount(0, new WalletDescriptor('Account 1'));
			const publicKey = await wallet.getPublicKey();

			return { user: result, publicKey };
		},
		[onGetUserInfoHash],
	);

	const onCreateNewUser = useCallback(
		async (password) => {
			try {
				if (!keyphrase) {
					throw new Error('Missing keyphrase');
				}

				// Create new User
				let user;
				try {
					user = new User(password);
				} catch (error) {
					return undefined;
				}

				// Set HDWallet info
				user.setHDWallet(keyphrase, encryptionType);

				const result = await onInitNewUserHandler(user);
				result.publicKey && onCreateSuccess(result);
				return result;
			} catch (err) {
				console.error(`🚀 ~ useCreateUser ~ err`, err);
				return undefined;
			}
		},
		[keyphrase, onCreateSuccess, onInitNewUserHandler],
	);

	return { onCreateNewUser };
};

export default useCreateUser;
