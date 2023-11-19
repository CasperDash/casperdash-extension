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
import { getTokenInfo } from '@cd/selectors/user';
import Eye from '@cd/assets/image/ic-eye.svg';
import EyeOff from '@cd/assets/image/ic-eye-off.svg';
import InfoIcon from '@cd/assets/image/about-us-icon.svg';
import { AccountManagerModal } from './AccountManagerModal';
import { AccountAssetsChart } from './AccountAssetsChart';

import './index.scss';

export const AccountInfo = () => {
	const [isOpenAccountModal, setIsOpenAccountModal] = useState(false);
	const [isOpenAccountDetailModal, setIsOpenAccountDetailModal] = useState(false);
	const { setBalanceVisible, isBalanceVisible } = useBalanceVisible();
	//Selectors
	const publicKey = useSelector(getPublicKey);
	const totalFiatBalance = useSelector(getAccountTotalBalanceInFiat);
	const selectedWallet = useSelector(getSelectedWallet);
	const loginOptions = useSelector(getLoginOptions);
	const CSPRInfo = useSelector(getTokenInfo('CSPR'));

	const handleOnCloseAccountModal = () => {
		setIsOpenAccountModal(false);
	};

	const handleOnOpenAccountModal = () => {
		setIsOpenAccountModal(true);
	};

	const handleOnCloseAccountDetailModal = () => {
		setIsOpenAccountDetailModal(false);
	};

	const handleOnOpenAccountDetailModal = () => {
		setIsOpenAccountDetailModal(true);
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
				<InfoIcon
					width={'20'}
					height={'20'}
					className="cd_we_info-icon"
					onClick={handleOnOpenAccountDetailModal}
				/>
			</div>
			{isOpenAccountModal && (
				<ServiceWorkerRequired>
					<AccountManagerModal isOpen={isOpenAccountModal} onClose={handleOnCloseAccountModal} />
				</ServiceWorkerRequired>
			)}

			<AccountAssetsChart
				isOpen={isOpenAccountDetailModal}
				onClose={handleOnCloseAccountDetailModal}
				activeCSPRAmount={CSPRInfo.balance?.displayValue}
				stakedCSPRAmount={CSPRInfo.totalStakedAmount}
				undelegatingCSPRAmount={CSPRInfo.totalUndelegatingAmount}
				totalFiatBalance={totalFiatBalance}
			/>
		</div>
	);
};
