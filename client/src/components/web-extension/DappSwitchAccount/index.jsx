import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { getPublicKey, isUsingLedgerSelector } from '@cd/selectors/user';
import { withServiceWorkerRequired } from '@cd/components/hocs/ServiceWorkerRequired';
import {
	addConnectedSite,
	cancelConnectingSite,
	closePopup,
	isUserExist
} from '@cd/components/hooks/useServiceWorker';
import { withDappConnectorRequired } from '@cd/components/hocs/DappConnectorRequired';
import { useNavigate } from 'react-router-dom';
import AccountItem from '@cd/common/AccountItem';
import useGetWallets from '@cd/hooks/useGetWallets';
import { useSelectWallet } from '@cd/hooks/useSelectWallet';
import { useGetCurrentConnectedUrl } from '@cd/hooks/dapp/useGetCurrentConnectedUrl';
import { useGetConnectedPublicKeys } from '@cd/hooks/dapp/useGetConnectedPublicKeys';

import './index.scss';

const DappSwitchAccount = ({isUserExisting}) => {
	const navigate = useNavigate();
	const publicKey = useSelector(getPublicKey);
	const { data: connectedUrl } = useGetCurrentConnectedUrl();
	const isUsingLedger = useSelector(isUsingLedgerSelector);
	const [wallets, loadWallets] = useGetWallets();
	const { selectWallet } = useSelectWallet();
	const { data: connectedPublicKeys } = useGetConnectedPublicKeys(connectedUrl);

	if (isUsingLedger) {
		navigate('/warningLedger');
	}

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

	const handleOnSwitchAccount = async (wallet) => {
		await selectWallet(wallet.uid);
		await closePopup();
	};

	const handleOnConnectAccount = async (wallet) => {
		await selectWallet(wallet.uid);
		await addConnectedSite(connectedUrl, [wallet.publicKey], wallet.publicKey);
		await closePopup();
	}

	const onCancel = () => {
		cancelConnectingSite();
	};

	const normalizedWallets = useMemo(() => {
		const connectedWallets = wallets.filter((wallet) => connectedPublicKeys.includes(wallet.publicKey));
		const unconnectedWallets = wallets.filter((wallet) => !connectedPublicKeys.includes(wallet.publicKey));

		const sortedWallets = [...connectedWallets, ...unconnectedWallets];

		return sortedWallets.map((wallet) => ({
			...wallet,
			isConnected: connectedPublicKeys.includes(wallet.publicKey),
		}));
	}, [wallets, connectedPublicKeys]);


	return (
		<div className="cd_we_dapp_switch_account">
			<div className="cd_we_dapp_switch_account_header">
				<div>
					<h1>Switch Your Accounts</h1>
				</div>
				<div className="cd_we_dapp_switch_account_site">
					<div className="cd_we_dapp_switch_account_site--text">{connectedUrl}</div>
				</div>
			</div>
			<div className="cd_we_dapp_switch_account_body">
				<div className="cd_we_dapp_switch_account_list">
					{
						normalizedWallets.map((wallet) => {
							const { isConnected } = wallet;

							return (
								<label key={wallet.uid} className="cd_we_dapp_switch_account_select">
									<AccountItem
										className="cd_we_dapp_switch_account_select--item"
										publicKey={wallet.publicKey}
										name={wallet.descriptor.name}
										selectedPublicKey={publicKey}
									/>
									{
										wallet.publicKey !== publicKey && (
											isConnected ? (
												<Button className="cd_we_dapp_switch_account_button" variant="normal" onClick={() => handleOnSwitchAccount(wallet)}>
													{'Switch'}
												</Button>
											) : (
												<Button className="cd_we_dapp_switch_account_button" variant="normal" onClick={() => handleOnConnectAccount(wallet)}>
													{'Connect'}
												</Button>
											)
										)
									}
								</label>
							);
						})
					}
				</div>
				<div className="cd_we_dapp_switch_account_buttons">
					<Button variant="normal" onClick={onCancel}>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
};

export default withDappConnectorRequired(withServiceWorkerRequired(DappSwitchAccount));
