import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WalletDescriptor } from 'casper-storage';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import isNil from 'lodash-es/isNil';
import clsx from 'clsx';

import useGetWallets from '@cd/hooks/useGetWallets';
import { onBindingAuthInfo, updateAccountIndex } from '@cd/actions/userActions';
import { addWalletAccount, setDefaultWallet } from '@cd/hooks/useServiceWorker';
import Divider from '@cd/components/Common/Divider';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText/index';
import { formatAccountName } from '@cd/helpers/format';

import CloseIcon from '@cd/assets/image/close-icon.svg';
import PlusIcon from '@cd/assets/image/plus-icon.svg';

import './AccountManagerModal.scss';
import { getAccountIndex } from '@cd/selectors/user';

export const AccountManagerModal = ({ isOpen, onClose, ...restProps }) => {
	const dispatch = useDispatch();
	const accountIndex = useSelector(getAccountIndex);

	const [wallets, loadWallets, isLoading] = useGetWallets();

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
			dispatch(updateAccountIndex(index));

			onClose();
		});
	};

	return (
		<Modal show={isOpen} onHide={onClose} backdropClassName="cd_we_accounts-modal--backdrop" className="cd_we_accounts-modal" centered {...restProps}>
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
							className={
								clsx('cd_we_accounts-modal__list-item', { selected: index === accountIndex})
							}
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
