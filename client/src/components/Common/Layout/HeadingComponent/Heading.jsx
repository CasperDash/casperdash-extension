import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useAutoRefreshEffect } from '@cd/hooks/useAutoRefreshEffect';
import { getPublicKey } from '@cd/selectors/user';
import { getTheme } from '@cd/selectors/settings';
import {
	getUserDetails,
	setPublicKey,
	deleteAllUserData,
	initConnectedAccountFromLocalStorage,
} from '@cd/actions/userActions';
import { switchTheme } from '@cd/actions/settingActions';
import { isValidPublicKey } from '@cd/helpers/validator';
import { DARK_THEME, LIGHT_THEME } from '@cd/constants/settings';
import { MiddleTruncatedText } from '@cd/common/MiddleTruncatedText';
import useCasperSigner from '@cd/hooks/useCasperSigner';
import useLedger from '@cd/hooks/useLedger';
import { AddPublicKeyModal } from './AddPublicKeyModal';
import { LedgerKeysModal } from './LedgerKeysModal';

const HeadingModule = (props) => {
	// Hook
	const publicKey = useSelector(getPublicKey);
	const dispatch = useDispatch();
	const { ConnectSignerButton, isAvailable } = useCasperSigner();
	const { handleConnectLedger, isUsingLedger, loadMoreKeys } = useLedger();

	// Selector
	const theme = useSelector(getTheme);

	// State
	const [showPublicKeyInput, setShowPublicKeyInput] = useState(false);
	const [showLedgerKeys, setShowLedgerKeys] = useState(false);
	const [publicKeyError, setPublicKeyError] = useState('');
	const [isLoadingKeys, setIsLoadingKey] = useState(false);
	const [ledgerKeys, setLedgerKeys] = useState([]);

	// Effect
	useAutoRefreshEffect(() => {
		if (publicKey) {
			dispatch(getUserDetails(publicKey));
		}
	}, [publicKey, dispatch]);

	useEffect(() => {
		if (!publicKey) {
			dispatch(initConnectedAccountFromLocalStorage());
		}
	}, [publicKey, dispatch]);

	// Function
	const onClickViewMode = () => {
		setShowPublicKeyInput(true);
	};

	const onClosePublicKeyModal = () => {
		setShowPublicKeyInput(false);
	};

	const onCloseLedgerKeysModal = () => {
		setShowLedgerKeys(false);
	};

	const handleAddPublicKey = (pk) => {
		if (isValidPublicKey(pk)) {
			dispatch(setPublicKey(pk));
			onClosePublicKeyModal();
		} else {
			setPublicKeyError('Invalid public key');
		}
	};

	const onSwitchTheme = () => {
		const newTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
		dispatch(switchTheme(newTheme));
	};

	const loadMoreLedgerKeys = async () => {
		if (!isLoadingKeys) {
			setIsLoadingKey(true);
			const keys = await loadMoreKeys(publicKey);
			setIsLoadingKey(false);
			if (!keys) {
				return;
			}
			setLedgerKeys(keys);
			setShowLedgerKeys(true);
		}
	};

	return (
		<>
			<div className="cd_all_page_heading_section">
				<div className="cd_all_page_heading">
					<h2>{props.name}</h2>
				</div>
				<div className="cd_all_page_notify_logout_btn">
					<Button className="cd_theme_switch" onClick={onSwitchTheme}>
						<i className={`bi ${theme === DARK_THEME ? 'bi-brightness-high-fill' : 'bi-moon-fill'}`} />
					</Button>
					{/* Display public key if available */}
					{publicKey && (
						<>
							<div className="cd_heading_public_key">
								<MiddleTruncatedText placement="bottom">{publicKey}</MiddleTruncatedText>
							</div>
							<Button
								className="cd_all_page_logout_btn"
								variant="secondary"
								onClick={() => dispatch(deleteAllUserData())}
							>
								Logout
							</Button>
						</>
					)}

					{isUsingLedger && (
						<>
							<Button
								className="cd_all_page_logout_btn"
								onClick={loadMoreLedgerKeys}
								disabled={isLoadingKeys}
							>
								{!isLoadingKeys ? 'Load more keys' : 'Loading'}
							</Button>
						</>
					)}

					{/* Display connect ledger button if no public key */}
					{!publicKey && (
						<Button
							className="cd_all_page_logout_btn"
							onClick={handleConnectLedger}
						>{`Connect Ledger`}</Button>
					)}

					{/* Display view mode button if no casper signed installed */}
					{!publicKey && !isAvailable && (
						<Button className="cd_all_page_logout_btn" onClick={onClickViewMode}>
							View Mode
						</Button>
					)}

					<ConnectSignerButton />
				</div>
				<AddPublicKeyModal
					show={showPublicKeyInput}
					handleClose={onClosePublicKeyModal}
					handleAddPublicKey={handleAddPublicKey}
					error={publicKeyError}
				/>
				<LedgerKeysModal show={showLedgerKeys} keys={ledgerKeys} handleClose={onCloseLedgerKeysModal} />
			</div>
		</>
	);
};

export default HeadingModule;
