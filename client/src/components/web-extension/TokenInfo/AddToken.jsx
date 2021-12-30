import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getTokenInfo, addCustomTokenAddressToLocalStorage } from '../../../actions/tokensActions';
import { getPublicKey } from '../../../selectors/user';
import './AddToken.scss';

export const AddToken = () => {
	//Hook
	const dispatch = useDispatch();
	const navigate = useNavigate();

	//Selector
	const publicKey = useSelector(getPublicKey);

	//State
	const [tokenAddress, setTokenAddress] = useState('');
	const [error, setError] = useState('');

	//Function
	const onAddToken = async () => {
		// fetch token info
		const { data } = await dispatch(getTokenInfo(tokenAddress));
		// show error if can not find token
		if (!data || !data.name) {
			setError('Can not find token info');
		} else {
			// set token address to local storage
			dispatch(addCustomTokenAddressToLocalStorage(tokenAddress, publicKey));
			navigate('/');
		}
	};

	return (
		<section className="cd_we_add_token">
			<div className="cd_we_input_label">Token Address</div>
			<input value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} />
			<div className="cd_error_text">{error}</div>
			<Button onClick={onAddToken}>Add</Button>
		</section>
	);
};
