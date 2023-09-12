import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import { updateEncryptionType } from '@cd/actions/createWalletActions';
import { selectCreateWalletEncryptionType } from '@cd/selectors/createWallet';
import { EncryptionType } from 'casper-storage';
import InfoIcon from '@cd/assets/image/info-icon.svg';
import { Tooltip } from 'react-tooltip';

import './style.scss';

const OPTIONS = [
	{ value: EncryptionType.Ed25519, label: EncryptionType.Ed25519 },
	{ value: EncryptionType.Secp256k1, label: EncryptionType.Secp256k1 },
];

const SelectEncryptionType = () => {
	const dispatch = useDispatch();
	const encryptionType = useSelector(selectCreateWalletEncryptionType);

	const onChangeSelectEncryptionType = (optionSelected) => {
		dispatch(updateEncryptionType(optionSelected.value));
	};

	const customControlStyles = {
		control: (provided) => ({
			...provided,
			height: '38px',
		}),

		valueContainer: (provided) => ({
			...provided,
			padding: '0 6px',
			height: '38px',
		}),
		placeHolder: (provided) => ({
			...provided,
		}),
		input: (provided) => ({
			...provided,
			margin: '0px',
			height: '38px',
		}),
		indicatorSeparator: () => ({
			display: 'none',
		}),
		indicatorsContainer: (provided) => ({
			...provided,
			height: '32px',
		}),
	};

	return (
		<div className="cd_we_encryption-type">
			<div>
				<span>Encryption Type</span>
				<span
					className="cd_we_encryption-type--tooltip"
					data-tooltip-id="encryption-type-tooltip"
					data-tooltip-content="We recommend to choose ed25519 over secp256k1 for stronger security and better
					performance, unless you explicitly want to use secp256k1 in order to compatible with
					Bitcoin, Ethereum chains"
				>
					<InfoIcon />
				</span>
				<Tooltip id="encryption-type-tooltip" />
			</div>
			<Select
				className="cd_we_dropdown"
				styles={customControlStyles}
				value={OPTIONS.find((option) => option.value === encryptionType)}
				options={OPTIONS}
				onChange={onChangeSelectEncryptionType}
			/>
		</div>
	);
};

export default SelectEncryptionType;
