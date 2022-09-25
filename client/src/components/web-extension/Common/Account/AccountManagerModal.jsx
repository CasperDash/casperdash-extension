import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WalletDescriptor } from 'casper-storage';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import isNil from 'lodash-es/isNil';

import useWallets from './useWallets';
import PlusIcon from '@cd/assets/image/plus-icon.svg';
import { onBindingAuthInfo, updateAccountName } from '@cd/actions/userActions';
import CloseIcon from '@cd/assets/image/close-icon.svg';
import { addWalletAccount, setDefaultWallet } from '@cd/hooks/useServiceWorker';
import Divider from '@cd/components/Common/Divider';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText/index';
import { formatAccountName } from '@cd/helpers/format';

import './AccountManagerModal.scss';

export const AccountManagerModal = ({ isOpen, onClose, ...restProps }) => {
	const dispatch = useDispatch();

	const [wallets, loadWallets, isLoading] = useWallets();

	useEffect(() => {
		if (isOpen) {
			loadWallets();
		}
	}, [isOpen]);

	const handleAddNewWallet = () => {
		addWalletAccount(wallets.length, new WalletDescriptor(formatAccountName(wallets.length))).then(() => {

			return loadWallets();
		});
	};

	const handleOnSelectWallet = (index) => {
		setDefaultWallet(index).then((result) => {
			const { publicKey, userDetails } = result;

			dispatch(onBindingAuthInfo({ publicKey, user: userDetails }));
			dispatch(updateAccountName(formatAccountName(index)));

			onClose();
		});
	};

	return (
		<Modal show={isOpen} onHide={onClose} className="cd_we_accounts-modal" {...restProps}>
			<Modal.Header>
				<button className="cd_we_accounts-modal__btn-close" onClick={onClose}>
					<CloseIcon />
				</button>
			</Modal.Header>
			<Modal.Body>
				<ul className="cd_we_accounts-modal__list">
					{wallets.map((wallet, index) => (
						<li
							key={`wallet-${index}`}
							className="cd_we_accounts-modal__list-item"
							onClick={() => handleOnSelectWallet(index)}
						>
							<div>{wallet.descriptor ? wallet.descriptor.name.name : formatAccountName(index)}</div>
							<div className="cd_we_accounts-modal__list-item-balance">
								{isNil(wallet.balance) ? (
									<Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="cd_we_accounts-modal__list-item-loading"/>
								) : (
									<MiddleTruncatedText>{`${wallet.balance}`}</MiddleTruncatedText> 
								)}
								<span>CSPR</span>
							</div>
						</li>
					))}
				</ul>
			</Modal.Body>
			<Divider className="cd_we_accounts-modal__divider" />
			<Modal.Footer>
				<Button variant="link" className="cd_we_accounts-modal__btn-action" disabled={isLoading} onClick={handleAddNewWallet}>
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
