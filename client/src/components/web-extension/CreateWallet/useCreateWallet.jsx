import { useContext } from "react";
import { CreateWalletContext } from "./Context";

const useCreateWalletStore = () => {
  return useContext(CreateWalletContext);
};

export default useCreateWalletStore;
