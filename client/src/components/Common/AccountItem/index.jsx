import React from 'react';
import clsx from 'clsx';
import { getBase64IdentIcon } from '@cd/helpers/identicon';
import { MiddleTruncatedText } from '@cd/common/MiddleTruncatedText';
import PropTypes from 'prop-types';

import './AccountItem.scss';

const AccountItem = ({publicKey, name, className, selectedPublicKey}) => {
	return (
		<div className={clsx('cd_we_account-item', className)}>
			<div className="cd_we_account-item--icon">
				<img width={34} src={getBase64IdentIcon(publicKey)} alt="account-public-key" />
			</div>
			<div className="cd_we_account-item--info">
				<div className={clsx({
					'cd_we_account-item--name': true,
					'cd_we_account-item--name-selected': publicKey === selectedPublicKey
				})}
				>
					{name}
				</div>
				<MiddleTruncatedText end={8} className="cd_we_account-item--public-key">
					{publicKey}
				</MiddleTruncatedText>
			</div>
		</div>
	)
}

AccountItem.propTypes = {
	publicKey: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	className: PropTypes.string,
	selectedPublicKey: PropTypes.string
}

export default AccountItem;