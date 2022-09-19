import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowIcon from '@cd/assets/image/bold-arrow-icon.svg';
import { ConfirmModal } from '@cd/components/Common/ConfirmModal';
import './index.scss';
import { useState } from 'react';

const SettingRow = ({ setting }) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

    const onProcess = () => setting.action({ dispatch, navigate });

    const handleOnClick = () => {
        if (setting.hasConfirmPopup) {
            setIsOpenModal(true);

            return;
        }

        onProcess();
    };

    const handleOnCloseModal = () => {
        setIsOpenModal(false)
    }

	return (
        <>
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
            {setting.hasConfirmPopup && (
                <ConfirmModal isOpen={isOpenModal} onOk={onProcess} onClose={handleOnCloseModal} description="Are your sure want to delete all data?"/>
            )}
        </>
	);
};

export default SettingRow;
