import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { createNewHDWallet } from '../../services/casperServices';
import { getCryptoInstance, getStorageWallet, deserializeKeys } from '../../services/userServices';
import { setSelectedWallet, updateCryptoInstance } from '../../actions/userActions';
import { getCurrentQuery } from '../../helpers/query';

export const Login = ({}) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [showPassword, setShowPassword] = useState(false);
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});

	const passwordFieldType = showPassword ? 'text' : 'password';

	const redirect = () => {
		const { path } = getCurrentQuery();
		try {
			const redirectPath = window.atob(path);
			history.push(redirectPath);
		} catch (err) {
			console.error(err);
			history.push('/dashboard');
		}
	};

	const onLogin = () => {
		const cryptoInstance = getCryptoInstance(password);
		const walletInfo = getStorageWallet(cryptoInstance);
		if (!walletInfo || !walletInfo.mnemonicPhase) {
			setErrors({ password: 'Incorrect Password' });
		} else {
			let selectedWallet;
			if (walletInfo.derivedWallets && walletInfo.derivedWallets.length) {
				const deserializedKeys = deserializeKeys(walletInfo.derivedWallets);
				selectedWallet = deserializedKeys[0];
			} else {
				const hdWallet = createNewHDWallet(walletInfo.mnemonicPhase);
				selectedWallet = hdWallet.deriveIndex(0);
			}
			dispatch(updateCryptoInstance(password));
			dispatch(setSelectedWallet(selectedWallet));
			redirect();
		}
	};
	return (
		<section className="cd_create_wallet_section">
			<div className="cd_create_wallet_content container">
				<div className="cd_create_wallet_input_list">
					<Form.Group className="cd_create_wallet_input_items">
						<Form.Label>Unlock wallet</Form.Label>
						<Form.Control
							type={passwordFieldType}
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={(e) => {
								setErrors({});
								if (e.key === 'Enter') {
									e.preventDefault();
									e.stopPropagation();
									onLogin();
								}
							}}
						/>
						<Form.Control.Feedback type="invalid" className="cd_create_wallet_error_msg">
							{errors.password}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="cd_create_wallet_input_items no-border">
						<Form.Check
							type="checkbox"
							label="Show password"
							onClick={(e) => setShowPassword(e.target.checked)}
							checked={showPassword}
						/>
					</Form.Group>
					<div className="cd_create_wallet_btn">
						<Link to={'#'} className="mx-auto" onClick={onLogin}>
							Login
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};
