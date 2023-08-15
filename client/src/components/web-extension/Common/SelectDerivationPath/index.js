import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import { updateDerivationPath } from '@cd/actions/createWalletActions';
import { selectCreateWalletDerivationPath } from '@cd/selectors/createWallet';
import InfoIcon from '@cd/assets/image/info-icon.svg';
import { DERIVATION_PATHS } from '@cd/constants/derivationPaths';
import { Tooltip } from 'react-tooltip';

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
		<div className="cd_we_derivation-path">
			<div className="cd_we_derivation-path--label">
				<span>Derivation Path</span>
				<span
					className="cd_we_derivation-path--tooltip"
					data-tooltip-id="derivation-path-tooltip"
					data-tooltip-content="A derivation path is a piece of data which tells a Hierarchical Deterministic (HD)
					wallet how to derive a specific key within a tree of keys"
				>
					<InfoIcon />
				</span>
				<Tooltip id="derivation-path-tooltip" />
			</div>
			<Select
				className="cd_we_dropdown"
				styles={customControlStyles}
				value={OPTIONS.find((option) => option.value === derivationPath)}
				options={OPTIONS}
				onChange={onChangeSelectEncryptionType}
			/>
		</div>
	);
};

export default SelectDerivationPath;
