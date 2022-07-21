import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { WalletDescriptor, User, EncryptionType } from 'casper-storage';
// import { onSetUserHashingOptions, onSetUserInfo } from '@cd/web-extension/CreateWallet/wallet/storage';
import { onSuccessCreatingWallet, setPublicKey } from '@cd/actions/userActions';
import { selectCreateWalletKeyphrase } from '@cd/selectors/createWallet';

const encryptionType = EncryptionType.Ed25519;
const useCreateUser = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const keyphrase = useSelector(selectCreateWalletKeyphrase);

	const onCreateSuccess = useCallback(
		(result) => {
			const { publicKey, user } = result;
			// dispatch(setPublicKey(publicKey, {
      //   userHashingOptions: user.userHashingOptions
      // }));
      dispatch(onSuccessCreatingWallet(publicKey, user));

			navigate('/');
		},
		[dispatch, navigate],
	);

	const onSaveUserHash = useCallback(async (user) => {
		// Take the hashing options from user's instance
		const hashingOptions = user.getPasswordHashingOptions();
		console.log(`🚀 ~ useCreateUser ~ hashingOptions`, hashingOptions);
		const userHashingOptions = JSON.stringify(hashingOptions);

		// Serialize user information to a secure encrypted string
		const userInfo = user.serialize();

		return {
			userHashingOptions,
			userInfo,
		};
	}, []);

	const onSaveHandler = useCallback(
		async (user) => {
			const result = await onSaveUserHash(user);

			// Create Wallet
			const wallet = await user.addWalletAccount(0, new WalletDescriptor('Account 1'));
			const publicKey = await wallet.getPublicKey();

			return { user: result, publicKey };
		},
		[onSaveUserHash],
	);

	const onCreateNewUser = useCallback(
		async (password) => {
			try {
				if (!keyphrase) {
					throw new Error('Missing keyphrase');
				}

				// Create new User
				const user = new User(password);

				// Set HDWallet info
				user.setHDWallet(keyphrase, encryptionType);

				const result = await onSaveHandler(user);
				result.publicKey && onCreateSuccess(result);
			} catch (err) {
				console.error(`🚀 ~ useCreateUser ~ err`, err);
				return undefined;
			}
		},
		[keyphrase, onCreateSuccess, onSaveHandler],
	);

	return { onCreateNewUser };
};

export default useCreateUser;
