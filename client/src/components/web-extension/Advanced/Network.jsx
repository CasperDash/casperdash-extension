import React from 'react';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { getNetwork } from '@cd/selectors/settings';
import { updateNetwork } from '@cd/actions/settingActions';

const OPTIONS = [
	{ value: 'casper', label: 'mainnet' },
	{ value: 'casper-test', label: 'testnet' },
];

const NetworkSelector = () => {
	const dispatch = useDispatch();
	const network = useSelector(getNetwork);

	const onChangeNetwork = (optionSelected) => {
		dispatch(updateNetwork(optionSelected.value));
	};

	return (
		<div className="cd_we_advanced__content network">
			<div className="cd_we_advanced__content-title">Network</div>
			<p className="cd_we_advanced__content-description">Select network</p>
			<div className="cd_we_advanced__content-item">
				<Select
					className="cd_we_dropdown"
					value={OPTIONS.find((option) => option.value === network)}
					options={OPTIONS}
					onChange={onChangeNetwork}
				/>
			</div>
		</div>
	);
};

export default NetworkSelector;
