import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getPublicKey, getAccountTotalBalanceInFiat, getAccountName } from '@cd/selectors/user';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';
import { toFormattedCurrency } from '@cd/helpers/format';
import ServiceWorkerRequired from '@cd/hocs/ServiceWorkerRequired';

import Copy from '@cd/components/Common/Button/Copy';
import { AccountManagerModal } from './AccountManagerModal';

import './index.scss';

export const AccountInfo = () => {
	const [isOpenAccountModal, setIsOpenAccountModal] = useState(false);
	//Selectors
	const publicKey = useSelector(getPublicKey);
	const accountName = useSelector(getAccountName);
	const totalFiatBalance = useSelector(getAccountTotalBalanceInFiat);

	const handleOnCloseAccountModal = () => {
		setIsOpenAccountModal(false);
	}

	const handleOnOpenAccountModal = () => {
		setIsOpenAccountModal(true);
	}

	return (
		<div className="cd_we_account">
			<div className="cd_we_account_info">
				<div className="cd_we_account_name" onClick={handleOnOpenAccountModal}>{accountName ?? 'Account 1'}</div>
				<div className="cd_we_address_section">
					<div className="cd_we_account_address">
						<MiddleTruncatedText end={4}>{publicKey}</MiddleTruncatedText>
					</div>
					<Copy value={publicKey} />
				</div>
			</div>
			<div className="cd_we_account_balance">{toFormattedCurrency(totalFiatBalance)}</div>
			<ServiceWorkerRequired>
				<AccountManagerModal isOpen={isOpenAccountModal} onClose={handleOnCloseAccountModal}/>
			</ServiceWorkerRequired>
		</div>
	);
};
