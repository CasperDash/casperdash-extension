import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getPublicKey, getAccountTotalBalanceInFiat, getAccountName } from '../../../../selectors/user';
import { MiddleTruncatedText } from '../../../Common/MiddleTruncatedText';
import { toFormattedCurrency } from '../../../../helpers/format';
import Copy from '../../../Common/Button/Copy';
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
				<div className="cd_we_account_name" onClick={handleOnOpenAccountModal}>{accountName ?? 'Account 0'}</div>
				<div className="cd_we_address_section">
					<div className="cd_we_account_address">
						<MiddleTruncatedText end={4}>{publicKey}</MiddleTruncatedText>
					</div>
					<Copy value={publicKey} />
				</div>
			</div>
			<div className="cd_we_account_balance">{toFormattedCurrency(totalFiatBalance)}</div>
			<AccountManagerModal isOpen={isOpenAccountModal} onClose={handleOnCloseAccountModal}/>
		</div>
	);
};
