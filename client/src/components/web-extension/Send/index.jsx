import React from 'react';
import { useLocation } from 'react-router-dom';
import SendForm from './SendForm';
import ConfirmSend from './ConfirmSend';
import './Send.scss';

const Send = () => {
	//Hook
	const location = useLocation();
	const {
		state: { token },
		hash,
	} = location;

	return (
		<section className="cd_we_send_page cd_we_single_section no_bottom_bar">
			{hash === '#confirm' ? <ConfirmSend token={token} /> : <SendForm token={token} />}
		</section>
	);
};

export default Send;
