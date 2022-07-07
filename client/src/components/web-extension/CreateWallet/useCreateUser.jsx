import { useCallback } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { WalletDescriptor, StorageManager as Storage, User, KeyFactory, EncryptionType } from "casper-storage";
import { setPublicKey } from "actions/userActions";
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

  const onSaveHandler = useCallback(async user => {
    // Take the hashing options from user's instance
    const hashingOptions = user.getPasswordHashingOptions();

    // Backup it into the storage
    await Storage.getInstance().set("casperwallet_userhashingoptions", JSON.stringify(hashingOptions));

    // Create Wallet
    const wallet = await user.addWalletAccount(0, new WalletDescriptor("Account 1"));
    const publicKey = await wallet.getPublicKey();

    // Serialize user information to a secure encrypted string 
    const userInfo = user.serialize();
    await Storage.getInstance().set("casperwallet_userinformation", userInfo);

    onCreateSuccess(publicKey);
  }, [onCreateSuccess]);

  const onCreateNewUser = useCallback(password => {
    try {
      if (!keyphrase) {
        throw new Error("Missing keyphrase");
      }

      // Create new User
      const user = new User(password);

      // Set HDWallet info
      user.setHDWallet(keyphrase, encryptionType);

      onSaveHandler(user);
    } catch (err) {
      console.error(`🚀 ~ useCreateUser ~ err`, err);    
    }
  }, [keyphrase, onSaveHandler]);

  return { onCreateNewUser };
};

export default useCreateUser;
