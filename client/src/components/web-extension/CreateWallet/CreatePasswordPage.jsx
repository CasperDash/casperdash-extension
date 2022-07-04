import React from "react";
import { Button } from 'react-bootstrap';

const CreatePasswordPage = () => {
  return (
    <div className="cd_we_create-wallet-layout--root">
      <div className="cd_we_create-wallet-layout--body">
        <p>Please enter password</p>
        <div>
          <input value={""} onChange={() => {}} placeholder="Enter public key" />
        </div>
      </div>
      <div className="cd_we_page--bottom">
        <Button className="cd_we_btn-next" disabled={false} onClick={() => {}}>
          Register
        </Button>
      </div>
    </div>
  )
};

export default CreatePasswordPage;