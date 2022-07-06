import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { WalletDescriptor, StorageManager as Storage, User, KeyFactory, EncryptionType } from "casper-storage";
import { useNavigate } from 'react-router-dom';
import RecoveryPhrasePage from "./RecoveryPhrasePage";
import ValidateKeyphrasePage from "./ValidateKeyphrasePage";
import CreatePasswordPage from "./CreatePasswordPage";
import useCreateWalletStore from "./useCreateWallet";
import "./CreateWallet.scss";

const encryptionType = EncryptionType.Ed25519;

const CreateWallet = () => {
  const navigate = useNavigate();
  const { currentStep } = useCreateWalletStore();
  const keyManager = KeyFactory.getInstance();
  const [keyPharses, setKeyphrase] = useState(null);

  const onSaveHandler = async user => {
    const hashingOptions = user.getPasswordHashingOptions();
    // Backup it into the storage
    await Storage.getInstance().set("casperwallet_userhashingoptions", JSON.stringify(hashingOptions));

    // Create Wallet
    const wallet = await user.addWalletAccount(0, new WalletDescriptor("Account 1"));
    const publicKey = await wallet.getPublicKey();
    console.log(`🚀 ~ CreateWal ~ wallet`, wallet)
    console.log(`🚀 ~ CreateWal ~ publicKey`, publicKey)

    const userInfo = user.serialize();
    await Storage.getInstance().set("casperwallet_userinformation", userInfo);

    // Redirect
    // navigate("/");
  }

  const onCreateUser = async keyphrase => {
    const password = "ASclnclvn@A141xzczcASD";
    const user = new User(password);

    if (keyphrase) {
      user.setHDWallet(keyphrase, encryptionType);
      onSaveHandler(user);
    }
  }

  const onGenerate = () => {
    const keyphrase = keyManager.generate();
    console.log(`🚀 ~ onGenerate ~ keyphrase`, keyphrase)
    const seed = keyManager.toSeed(keyphrase);
    console.log(`🚀 ~ onGenerate ~ seed`, seed)
    setKeyphrase(keyphrase);

    const isValid = keyManager.validate(keyphrase);
    console.log(`🚀 ~ onGenerate ~ isValid`, isValid);

    // Create User
    onCreateUser(keyphrase);
  }

  useEffect(() => {
    const reload = async () => {
      if (Storage) {
        const abc = await Storage.getInstance().get("casperwallet_userinformation");
        console.log(`🚀 ~ useEffect ~ abc`, abc)
      }
    };

    reload();
  }, [keyPharses]);

  return (
    <section className="cd_we_page--root">
      {currentStep === 0 && <RecoveryPhrasePage />}
      {currentStep === 1 && <CreatePasswordPage />}
      {/* {currentStep === 1 && <ValidateKeyphrasePage />}
      {currentStep === 2 && <CreatePasswordPage />} */}
    </section>
	);
};

export default compose(
  connect(
    state => {
      console.log(`🚀 ~ state`, state)
      return {}
    }
  )
)(CreateWallet);