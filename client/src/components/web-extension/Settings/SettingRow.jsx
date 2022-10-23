import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowIcon from '@cd/assets/image/bold-arrow-icon.svg';
import './index.scss';

const SettingRow = ({ setting }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onProcess = () => setting.action({ dispatch, navigate });

	const handleOnClick = () => {
		onProcess();
	};

	return (
		<div className="cd_setting--wrapper">
			<div className="cd_setting_row" key={setting.name} onClick={handleOnClick}>
				<div className="cd_setting_row_left">
					<div className={`cd_setting_icon ${setting.icon.className}`}>{setting.icon.img}</div>
					<div className="cd_setting_name">{setting.name}</div>
				</div>
				{setting.hasMenu && (
					<div>
						<ArrowIcon />
					</div>
				)}
			</div>
		</div>
	);
};

export default SettingRow;
