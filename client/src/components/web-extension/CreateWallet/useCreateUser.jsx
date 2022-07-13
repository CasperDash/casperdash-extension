import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { WalletDescriptor, User, EncryptionType } from "casper-storage";
import { onSetUserHashingOptions, onSetUserInfo } from "web-extension/CreateWallet/wallet/storage";
import { setPublicKey } from "actions/userActions";
import { isStrongPassword } from "./utils";
import useCreateWalletStore from './useCreateWallet';

const encryptionType = EncryptionType.Ed25519;
const useCreateUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { keyPhrase: keyphrase } = useCreateWalletStore();

  const onCreateSuccess = useCallback((publicKey) => {
    dispatch(setPublicKey(publicKey));

		navigate('/');
  }, [dispatch, navigate]);

  const onSaveUserHash = useCallback(async user => {
    // Take the hashing options from user's instance
    const hashingOptions = user.getPasswordHashingOptions();
    console.log(`🚀 ~ useCreateUser ~ hashingOptions`, hashingOptions)
    const userHashingOptions = JSON.stringify(hashingOptions);

    // Serialize user information to a secure encrypted string
    const userInfo = user.serialize();

    // Backup it into the storage
    await onSetUserHashingOptions(userHashingOptions);
    await onSetUserInfo(userInfo);

    return {
      userHashingOptions,
      userInfo
    };
  }, []);

  const onSaveHandler = useCallback(async user => {
    const result = await onSaveUserHash(user);

    // Create Wallet
    const wallet = await user.addWalletAccount(0, new WalletDescriptor("Account 1"));
    const publicKey = await wallet.getPublicKey();

    return { result, publicKey }
  }, [onSaveUserHash]);

  const onCreateNewUser = useCallback(async password => {
    try {
      if (!keyphrase) {
        throw new Error("Missing keyphrase");
      }

      if (!isStrongPassword(password)) {
        throw new Error("Password not strong enough");
      }

      // Create new User
      const user = new User(password);

      // Set HDWallet info
      user.setHDWallet(keyphrase, encryptionType);
      // const testA = user.getHDWallet();
      // console.log(`🚀 ~ useCreateUser ~ testA`, testA)

      const result = await onSaveHandler(user);
      console.log(`🚀 ~ useCreateUser ~ result`, result)
      result.publicKey && onCreateSuccess(result.publicKey)
    } catch (err) {
      console.error(`🚀 ~ useCreateUser ~ err`, err);
    }
  }, [keyphrase, onCreateSuccess, onSaveHandler]);

  return { onCreateNewUser };
};

export default useCreateUser;
