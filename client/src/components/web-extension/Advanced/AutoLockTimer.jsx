import React from 'react';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { getAutoLockTime } from '@cd/selectors/settings';
import { ONE_MINUTE } from '@cd/constants/time';
import { updateAutoLockTime } from '@cd/actions/settingActions';

const OPTIONS = [
	{ value: 0.5 * ONE_MINUTE, label: '30s' },
	{ value: ONE_MINUTE, label: '1 minute' },
	{ value: 5 * ONE_MINUTE, label: '5 minutes' },
	{ value: 10 * ONE_MINUTE, label: '10 minutes' },
	{ value: 30 * ONE_MINUTE, label: '30 minutes' },
];

const AutoLockTimer = () => {
	const dispatch = useDispatch();
	const autoLockTime = useSelector(getAutoLockTime);

	const onChangeSelectEncryptionType = (optionSelected) => {
		dispatch(updateAutoLockTime(optionSelected.value));
	};

	return (
		<div className="cd_we_advanced__content">
			<div className="cd_we_advanced__content-title">Auto-lock timer (minutes)</div>
			<p className="cd_we_advanced__content-description">
				Select the amount of time of inactivity in minutes before CaseperDash locks.
			</p>
			<div className="cd_we_advanced__content-item">
				<Select
					className="cd_we_dropdown"
					value={OPTIONS.find((option) => option.value === autoLockTime)}
					options={OPTIONS}
					onChange={onChangeSelectEncryptionType}
				/>
			</div>
		</div>
	);
};

export default AutoLockTimer;
