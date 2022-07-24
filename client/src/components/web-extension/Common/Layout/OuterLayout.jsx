import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { OuterHeader } from '@cd/web-extension/Common/Header/OuterHeader';
import './OuterLayout.scss';

const OuterLayout = () => {
  const [header, setHeader] = useState(undefined);

	return (
    <div className={`cd_all_pages_content`}>
      <OuterHeader header={header} setHeader={setHeader} />

      <div className="cd_web_extension_outer_content">
        <Outlet context={[header, setHeader]} />
      </div>
    </div>
	);
};

export default OuterLayout;
