import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getPublicKey, getAccountTotalBalanceInFiat, getSelectedWallet, getLoginOptions } from '@cd/selectors/user';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';
import { toFormattedCurrency } from '@cd/helpers/format';
import ServiceWorkerRequired from '@cd/hocs/ServiceWorkerRequired';
import Copy from '@cd/components/Common/Button/Copy';
import EditIcon from '@cd/assets/image/edit-icon.svg';
import { CONNECTION_TYPES } from '@cd/constants/settings';
import BalanceDisplay from '@cd/common/BalanceDisplay';
import useBalanceVisible from '@cd/hooks/useBalanceVisible';
import Eye from '@cd/assets/image/ic-eye.svg';
import EyeOff from '@cd/assets/image/ic-eye-off.svg';
import { AccountManagerModal } from './AccountManagerModal';


import './index.scss';


export const AccountInfo = () => {
	const [isOpenAccountModal, setIsOpenAccountModal] = useState(false);
	const { setBalanceVisible, isBalanceVisible } = useBalanceVisible();
	//Selectors
	const publicKey = useSelector(getPublicKey);
	const totalFiatBalance = useSelector(getAccountTotalBalanceInFiat);
	const selectedWallet = useSelector(getSelectedWallet);
	const loginOptions = useSelector(getLoginOptions);

	const handleOnCloseAccountModal = () => {
		setIsOpenAccountModal(false);
	};

	const handleOnOpenAccountModal = () => {
		setIsOpenAccountModal(true);
	};

	return (
		<div className="cd_we_account">
			<div className="cd_we_account_info">
				{loginOptions && loginOptions.connectionType === CONNECTION_TYPES.privateKey ? (
					<div className="cd_we_account_name" onClick={handleOnOpenAccountModal}>
						<span>{selectedWallet && selectedWallet.descriptor && selectedWallet.descriptor.name}</span>
						<EditIcon />
					</div>
				) : (
					<div className="cd_we_account_name">
						<span>Account 1</span>
					</div>
				)}
				<div className="cd_we_address_section">
					<div className="cd_we_account_address">
						<MiddleTruncatedText end={4}>{publicKey}</MiddleTruncatedText>
					</div>
					<div className="cd_we_account_address_copy">
						<Copy value={publicKey} />
					</div>
				</div>
			</div>
			<div className="cd_we_account_balance">
				<BalanceDisplay balance={toFormattedCurrency(totalFiatBalance)} />
				<div className="cd_we_account_balance_visibility" onClick={() => setBalanceVisible(!isBalanceVisible)}>
					{isBalanceVisible ? <Eye /> : <EyeOff />}
				</div>
			</div>
			{isOpenAccountModal && (
				<ServiceWorkerRequired>
					<AccountManagerModal isOpen={isOpenAccountModal} onClose={handleOnCloseAccountModal} />
				</ServiceWorkerRequired>
			)}
		</div>
	);
};
