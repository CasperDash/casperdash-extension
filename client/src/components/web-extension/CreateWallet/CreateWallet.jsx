import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
// import { WalletDescriptor, StorageManager as Storage, User, KeyFactory, EncryptionType } from "casper-storage";
// import { useNavigate } from 'react-router-dom';
import RecoveryPhrasePage from "./RecoveryPhrasePage";
import ValidateKeyphrasePage from "./ValidateKeyphrasePage";
import CreatePasswordPage from "./CreatePasswordPage";
import useCreateWalletStore from "./useCreateWallet";
import "./CreateWallet.scss";

// const encryptionType = EncryptionType.Ed25519;

const CreateWallet = () => {
  // const navigate = useNavigate();
  const { currentStep } = useCreateWalletStore();
  // const keyManager = KeyFactory.getInstance();
  // const [keyPharses, setKeyphrase] = useState(null);

  // const onCreateUser = async keyphrase => {
  //   const password = "ASclnclvn@A141xzczcASD";
  //   const user = new User(password);

  //   if (keyphrase) {
  //     user.setHDWallet(keyphrase, encryptionType);
  //     onSaveHandler(user);
  //   }
  // }

  // const onGenerate = () => {
  //   const keyphrase = keyManager.generate();
  //   const seed = keyManager.toSeed(keyphrase);
  //   setKeyphrase(keyphrase);
  //   const isValid = keyManager.validate(keyphrase);


  //   // Create User
  //   // onCreateUser(keyphrase);
  // }

  useEffect(() => {
    const reload = async () => {
      // if (Storage) {
      //   const abc = await Storage.getInstance().get("casperwallet_userinformation");
      //   console.log(`🚀 ~ useEffect ~ abc`, abc)
      // }
    };

    reload();
  }, []);

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
