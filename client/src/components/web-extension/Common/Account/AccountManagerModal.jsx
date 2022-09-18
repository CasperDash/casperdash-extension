import React, {useState, useEffect, useCallback} from 'react';
import { WalletDescriptor } from 'casper-storage';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import PlusIcon from '@cd/assets/image/plus-icon.svg';
import { onBindingAuthInfo, updateAccountName } from '@cd/actions/userActions';
import CloseIcon from '@cd/assets/image/close-icon.svg';
import { getUserHDWallets, addWalletAccount, setDefaultWallet } from '@cd/hooks/useServiceWorker';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';
import Divider from '@cd/components/Common/Divider';

import './AccountManagerModal.scss';

const formatAccountName = (index = 0) => {
	return `Account ${index}`;
}

export const AccountManagerModal = ({ isOpen, onClose, ...resProps }) => {
	const [wallets, setWallets] = useState([]);
	const dispatch = useDispatch();

	const getUserWallets = useCallback(async() => {
		let hdWallets = await getUserHDWallets();
		if (hdWallets.length === 0) {
			await addWalletAccount(wallets.length, new WalletDescriptor(formatAccountName()));
			hdWallets = await getUserHDWallets();
		}
		
		setWallets(hdWallets);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		getUserWallets();
	}, [isOpen, getUserWallets]);

	const handleAddNewWallet = () => {
		addWalletAccount(wallets.length, new WalletDescriptor(formatAccountName(wallets.length)))
			.then(() => {
				return getUserWallets();
			});
	}

	const handleOnSelectWallet = (index, walletAccount) => {
		setDefaultWallet(index, walletAccount).then(result => {
			const { publicKey, userDetails } = result;

			dispatch(onBindingAuthInfo({ publicKey, user: userDetails }));
			dispatch(updateAccountName(formatAccountName(index)));

			onClose();
		})
	}

	return (
		<Modal show={isOpen} onHide={onClose} className="cd_we_accounts-modal" {...resProps}>
			<Modal.Header>
				<div className="cd_we_accounts-modal__btn-close" onClick={onClose}>
					<CloseIcon/>
				</div>
			</Modal.Header>
			<Modal.Body>
				<ul className="cd_we_accounts-modal__list">
					{
						wallets.map((wallet, index) => (
							<li key={`wallet-${index}`} className="cd_we_accounts-modal__list-item" onClick={() => handleOnSelectWallet(index, wallet)}>
								<div>{wallet.descriptor ? wallet.descriptor.name.name : formatAccountName(index)}</div>
								<div className="cd_we_accounts-modal__list-item-address">
									<MiddleTruncatedText>{wallet.publicKey}</MiddleTruncatedText>
								</div>
							</li>
						))
					}
				</ul>
			</Modal.Body>
			<Divider className="cd_we_accounts-modal__divider"/>
			<Modal.Footer>
				<Button variant="link" className="cd_we_accounts-modal__btn-action" onClick={handleAddNewWallet}>
					<span className="btn-icon">
						<PlusIcon />
					</span>
					<span className="btn-text">Create New Account</span>
				</Button>
				{/* 
				// TODO: Show button after feature developed.
				<Button variant="link" onClick={onClose} className="cd_we_accounts-modal__btn-action import-account">
					<span className="btn-icon">
						<ImportAccount />
					</span>
					<span className="btn-text">Import Account</span>
				</Button> */}
			</Modal.Footer>
		</Modal>
	);
};
