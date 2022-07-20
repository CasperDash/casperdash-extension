import React from 'react';
import { Outlet } from 'react-router-dom';
import CreateWalletProvider from "@cd/web-extension/CreateWallet/Context";
import { OuterHeader } from '@cd/web-extension/Common/Header/OuterHeader';
import './OuterLayout.scss';

const OuterLayout = () => {
	return (
    <CreateWalletProvider>
      <div className={`cd_all_pages_content`}>
        <OuterHeader />

        <div className="cd_web_extension_outer_content">
          <Outlet />
        </div>
      </div>
    </CreateWalletProvider>
	);
};

export default OuterLayout;
