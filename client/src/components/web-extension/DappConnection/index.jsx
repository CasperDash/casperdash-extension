import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { getPublicKey, isUsingLedgerSelector } from '@cd/selectors/user';
import { withServiceWorkerRequired } from '@cd/components/hocs/ServiceWorkerRequired';
import {
	addConnectedSite,
	cancelConnectingSite,
	closePopup,
	getCurrentConnectedUrl,
	isUserExist,
} from '@cd/components/hooks/useServiceWorker';
import { withDappConnectorRequired } from '@cd/components/hocs/DappConnectorRequired';
import { useNavigate } from 'react-router-dom';
import AccountItem from '@cd/common/AccountItem';
import useGetWallets from '@cd/hooks/useGetWallets';
import { useFormik } from 'formik';
import { useSelectWallet } from '@cd/hooks/useSelectWallet';
import { useGetConnectedPublicKeys } from '@cd/hooks/dapp/useGetConnectedPublicKeys';

import './index.scss';

const DappConnection = ({ isUserExisting }) => {
	const navigate = useNavigate();
	const [connectedUrl, setConnectedUrl] = useState('');
	const publicKey = useSelector(getPublicKey);
	const isUsingLedger = useSelector(isUsingLedgerSelector);
	const [wallets, loadWallets] = useGetWallets();
	const { selectWallet } = useSelectWallet();

	const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
		initialValues: {
			selectedUIDs: [],
		},
		onSubmit: async (values) => {
			const foundWallets = wallets.filter((wallet) => values.selectedUIDs.includes(wallet.uid));
			if (foundWallets.length === 0) {
				return;
			}

			const selectedPublicKeys = foundWallets.map((wallet) => wallet.publicKey);
			const unSelectedPublicKeys = wallets.filter((wallet) => !selectedPublicKeys.includes(wallet.publicKey)).map((wallet) => wallet.publicKey);

			const activeWallet = foundWallets[0];
			await selectWallet(activeWallet.uid);
			await addConnectedSite(connectedUrl, selectedPublicKeys, activeWallet.publicKey, unSelectedPublicKeys);
			await closePopup();
		}
	})

	const { data: connectedPublicKeys } = useGetConnectedPublicKeys(connectedUrl);


	if (isUsingLedger) {
		navigate('/warningLedger');
	}

	// TODO: Refactor this later with useQuery
	useEffect(() => {
		let selectedPublicKeys = [];
		if (publicKey) {
			selectedPublicKeys = [publicKey];
		}
		if (connectedPublicKeys) {
			selectedPublicKeys = [...selectedPublicKeys, ...connectedPublicKeys];
		}

		if (!wallets) {
			return;
		}
		const selectedUIDs = wallets.filter((wallet) => selectedPublicKeys.includes(wallet.publicKey)).map((wallet) => wallet.uid);

		setFieldValue('selectedUIDs', selectedUIDs);
	}, [connectedPublicKeys, wallets, setFieldValue, publicKey]);

	useEffect(() => {
		const loadConnectedUrl = async () => {
			const connectedUrl = await getCurrentConnectedUrl();
			setConnectedUrl(connectedUrl);
		};

		loadConnectedUrl();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const loadUserWallets = async () => {
			const isExistUser = await isUserExist();
			if (isExistUser) {
				loadWallets(false);
			}
		}

		if (isUserExisting) {
			loadUserWallets();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isUserExisting]);

	const onCancel = () => {
		cancelConnectingSite();
	};

	const isDisabled = values.selectedUIDs.length === 0;

	return (
		<form className="cd_we_dapp_connect_account" onSubmit={handleSubmit}>
			<div>
				<div className="cd_we_dapp_connect_account_header">
					<div className="cd_we_dapp_connect_account_title">
						<h1>Connect with CasperDash</h1>
					</div>
					<div className="cd_we_dapp_connect_account_description">
						Select account(s) to use on this site:
					</div>
					<div className="cd_we_dapp_connect_account_site">
						<div className="cd_we_dapp_connect_account_site--text">{connectedUrl}</div>
					</div>
				</div>
				<div className="cd_we_dapp_connect_account_list">
					{
						wallets.map((wallet) => {
							return (
								<label key={wallet.uid} className="cd_we_dapp_connect_account_select">
									<input checked={values.selectedUIDs.includes(wallet.uid)} type="checkbox" name="selectedUIDs" onChange={handleChange} value={wallet.uid} />
									<AccountItem
										className="cd_we_dapp_connect_account_select--item"
										publicKey={wallet.publicKey}
										name={wallet.descriptor.name}
										selectedPublicKey={publicKey}
									/>
								</label>
							);
						})
					}
				</div>
			</div>
			<div className="cd_we_dapp_connect_account_buttons">
				<Button className="cd_we_dapp_connect_account_buttons--cancel" variant="secondary" onClick={onCancel}>
					Cancel
				</Button>
				<Button className="cd_we_dapp_connect_account_buttons--connect" variant="primary" type="submit" disabled={isDisabled}>
					Connect
				</Button>
			</div>
		</form>
	);
};

export default withDappConnectorRequired(withServiceWorkerRequired(DappConnection));
