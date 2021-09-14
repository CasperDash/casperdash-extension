import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { getPublicAddress, getConnectError } from '../../../selectors/user';
import { connectCasper } from '../../../actions/userActions';

const HeadingModule = (props) => {
	const userAddress = useSelector(getPublicAddress);
	const connectError = useSelector(getConnectError);
	const dispatch = useDispatch();

	const handleConnect = () => {
		dispatch(connectCasper());
	};

	return (
		<>
			<div className="zl_all_page_heading_section">
				<div className="zl_all_page_heading">
					<h2>{props.name}</h2>
				</div>

				<div className="zl_all_page_notify_logout_btn">
					<span className="zl_all_page_error">{connectError}</span>
					{!userAddress ? <Button onClick={handleConnect}>Connect Casper</Button> : userAddress}
				</div>
			</div>
		</>
	);
};

export default HeadingModule;
