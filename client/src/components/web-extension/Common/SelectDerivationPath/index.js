import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { updateDerivationPath, updateEncryptionType } from '@cd/actions/createWalletActions';
import { selectCreateWalletDerivationPath } from '@cd/selectors/createWallet';
import InfoIcon from '@cd/assets/image/info-icon.svg';
import { DERIVATION_PATHS } from '@cd/constants/derivationPaths';

import './style.scss';

export const OPTIONS = [
	{
	  value: DERIVATION_PATHS.CASPERDASH,
	  label: `m/44'/506'/index (CasperDash)`,
	},
	{
	  value: DERIVATION_PATHS.CASPERWALLET,
	  label: `m/44'/506'/0'/0/index (Casper Wallet)`,
	},
];

const SelectDerivationPath = () => {
	const dispatch = useDispatch();
	const derivationPath = useSelector(selectCreateWalletDerivationPath);

	const onChangeSelectEncryptionType = (optionSelected) => {
		dispatch(updateDerivationPath(optionSelected.value));
	};

	const customControlStyles = (base) => ({
		...base,
	});

	return (
		<div className="cd_we_encryption-type">
			<div>
				<span>Derivation Path</span>
				<span className="cd_we_encryption-type--tooltip">
					<OverlayTrigger
						placement="auto"
						overlay={
							<Tooltip>
								We recommend to choose ed25519 over secp256k1 for stronger security and better
								performance, unless you explicitly want to use secp256k1 in order to compatible with
								Bitcoin, Ethereum chains
							</Tooltip>
						}
					>
						<span>
							<InfoIcon />
						</span>
					</OverlayTrigger>
				</span>
			</div>
			<Select
				className="cd_we_dropdown"
				styles={{ control: customControlStyles }}
				value={OPTIONS.find((option) => option.value === derivationPath)}
				options={OPTIONS}
				onChange={onChangeSelectEncryptionType}
			/>
		</div>
	);
};

export default SelectDerivationPath;
