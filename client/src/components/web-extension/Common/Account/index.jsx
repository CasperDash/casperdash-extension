import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getPublicKey, getAccountTotalBalanceInFiat } from '@cd/selectors/user';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';
import { formatAccountName, toFormattedCurrency } from '@cd/helpers/format';
import ServiceWorkerRequired from '@cd/hocs/ServiceWorkerRequired';
import Copy from '@cd/components/Common/Button/Copy';
import EditIcon from '@cd/assets/image/edit-icon.svg';
import { getCurrentIndexByPublicKey } from '@cd/components/hooks/useServiceWorker';
import { AccountManagerModal } from './AccountManagerModal';
import './index.scss';

export const AccountInfo = () => {
	const [accountName, setAccountName] = useState('Account 1');
	const [isOpenAccountModal, setIsOpenAccountModal] = useState(false);
	//Selectors
	const publicKey = useSelector(getPublicKey);
	const totalFiatBalance = useSelector(getAccountTotalBalanceInFiat);

	useEffect(() => {
		getCurrentIndexByPublicKey(publicKey).then((index = 0) => setAccountName(formatAccountName(index)));
	},[publicKey]);

	const handleOnCloseAccountModal = () => {
		setIsOpenAccountModal(false);
	}

	const handleOnOpenAccountModal = () => {
		setIsOpenAccountModal(true);
	}

	return (
		<div className="cd_we_account">
			<div className="cd_we_account_info">
				<div className="cd_we_account_name" onClick={handleOnOpenAccountModal}>
					<span>
						{accountName}
					</span>
					<EditIcon />
				</div>
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
