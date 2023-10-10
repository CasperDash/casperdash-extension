import _get from 'lodash-es/get';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getValueByFormat } from '@cd/helpers/format';
import Copy from '@cd/components/Common/Button/Copy';
import ViewInExplorer from '@cd/components/Common/Button/ViewInExplorer';
import { getTokenStandardName } from '@cd/helpers/nft';
import clsx from 'clsx';
import { mapTransactionStatus } from '@cd/helpers/transaction';

import './NFTTransferHistory.scss';

const DETAILS_MAPPING = [
	{ label: 'Name', value: 'name' },
	{ label: 'Token ID', value: 'tokenId' },
	{ label: 'Contract Package Hash', value: 'contractAddress', copy: true },
	{ label: 'Token Standard', value: 'tokenStandard' },
	{ label: 'Sending address', value: 'fromPublicKeyHex', copy: true },
	{ label: 'Receiving address', value: 'toPublicKeyHex', copy: true },
	{ label: 'Network Fee', value: 'paymentAmount', format: 'mote', suffix: 'CSPR' },
	{ label: 'Transaction Time', value: 'timestamp', format: 'date' },
	{ label: 'Transaction Hash', value: 'deployHash', copy: true },
];

const NFTTransferHistory = () => {
	// Hook
	const {
		state: { deploy },
	} = useLocation();

	const transferHistory = useMemo(() => {
		if (!deploy) {
			return {};
		}
		const transactionStatus = mapTransactionStatus(deploy.status);

		return {
			...deploy,
			tokenStandard: getTokenStandardName(deploy.tokenStandardId),
			statusLabel: transactionStatus.label,
			statusClass: transactionStatus.className,
			tokenId: deploy.tokenId ? `#${deploy.tokenId}` : '',
		}
	},[deploy]);

	return (
		<section className="cd_we_transfer_history cd_we_single_section">
			<div className="cd_we_transfer_history_header">
				{DETAILS_MAPPING.map(({ label, value, format, copy }, i) => {
					const deployValue = _get(transferHistory, value, '');
					const formattedValue = format ? getValueByFormat(deployValue, { format }) : deployValue;
					return (
						<div key={i} className="cd_we_transfer_history_item">
							<div className="cd_we_input_label">{label}</div>
							<div className={'cd_we_item_value'}>
								{formattedValue}
								{copy && <Copy value={deployValue} />}
							</div>
						</div>
					);
				})}
			</div>
			<div className="cd_we_transfer_history_bottom">
				<div className={clsx(
					'cd_we_item_value',
					transferHistory.statusClass
				)}
				>{transferHistory.statusLabel}</div>
				<div className="cd_we_view_in_explorer">
					<ViewInExplorer value={transferHistory.deployHash} type="deploy" text="View in explorer" />
				</div>
			</div>
		</section>
	);
};

export default NFTTransferHistory;
