import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowIcon from '@cd/assets/image/bold-arrow-icon.svg';
import './index.scss';
import LoginModalConfirm from '../Common/LoginModal/LoginModalForm';

const SettingRow = ({ setting }) => {
	const [isOpenModal, setIsOpenModal] = useState()
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onProcess = () => setting.action({ dispatch, navigate });

	const handleOnClick = () => {
		if (setting.isRequiredPassword) {
			setIsOpenModal(true);
			return;	
		}

		onProcess();
	};

	const handleOnLoginSuccess = () => {
		onProcess();
	}

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
			<LoginModalConfirm isOpen={isOpenModal} onLoginSuccess={handleOnLoginSuccess}/>
		</div>
	);
};

export default SettingRow;
