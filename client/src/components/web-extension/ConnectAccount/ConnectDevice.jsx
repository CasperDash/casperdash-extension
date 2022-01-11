import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CasperDashLogo from 'assets/image/Logo-only.svg';
import HardwareIcon from 'assets/image/hardware-icon.svg';
import { toast } from 'react-toastify';
import { TailSpin } from '../../Common/Spinner';
import { getBatchUserDetails, setPublicKey } from '../../../actions/userActions';
import { getMassagedBatchUserDetails } from '../../../selectors/user';
import { CONNECTION_TYPES } from '../../../constants/settings';
import useLedger from '../../hooks/useLedger';
import Grid from '../Common/Grid';

import './ConnectDevice.scss';

const LIST_KEY_METADATA = {
	left: [{ key: 'publicKey', type: 'primary' }],
	right: [
		{
			key: 'balance.displayBalance',
			type: 'primary',
			suffix: 'CSPR',
			component: ({ isLoading, value }) => <>{isLoading ? <TailSpin width={20} height={20} /> : value}</>,
		},
	],
};

const ConnectDevice = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [listKeys, setListKeys] = useState([]);
	const [moreKeys, setMoreKeys] = useState([]);

	const listDetails = useSelector(getMassagedBatchUserDetails(listKeys));

	const { loadMoreKeys } = useLedger();

	const onConnectClick = async () => {
		const toastId = toast.loading('Loading keys');
		const keys = await loadMoreKeys(undefined, listKeys.length);
		setListKeys([...listKeys, ...keys]);
		setMoreKeys(keys);
		toast.update(toastId, { isLoading: false, autoClose: 1 });
	};

	useEffect(() => {
		moreKeys.map(async (key) => {
			dispatch(getBatchUserDetails(key.publicKey));
		});
	}, [moreKeys, dispatch]);

	const onKeyClick = (key) => {
		dispatch(
			setPublicKey(key.publicKey, {
				connectionType: CONNECTION_TYPES.ledger,
				keyIndex: key.keyIndex,
			}),
		);
		navigate('/');
	};

	return (
		<div className="cd_we_connect_device">
			<div className="cd_we_connect_account_logo">
				<CasperDashLogo />
				<div>Casper Dash</div>
			</div>
			{!listDetails || !listDetails.length ? (
				<>
					<h1>Connect a hardware wallet</h1>
					<Button variant="normal" onClick={onConnectClick}>
						<HardwareIcon />
						Connect Ledger
					</Button>
				</>
			) : (
				<>
					<h1>Chose your key</h1>
					<Grid
						data={listDetails}
						metadata={LIST_KEY_METADATA}
						className="hide_scroll_bar"
						onRowClick={onKeyClick}
					/>
					<Button className="cd_we_btn_load_more" onClick={onConnectClick}>
						Load More
					</Button>
				</>
			)}
		</div>
	);
};

export default ConnectDevice;
