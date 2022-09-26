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
                <ConfirmModal 
                    isOpen={isOpenModal} 
                    onOk={onProcess} 
                    onClose={handleOnCloseModal}
                    title="Are you sure you want to delete your wallet ?"
                    description={
                        (
                            <div className="cd_setting_modal">
                                <div>Your current wallet, accounts and assets will be removed from this app permanently. This action cannot be undone.</div>
                                <br/>
                                <div>Your can ONLY recover this wallet with your Secret Recovery Phase CasperDash does not have your Secret Recovery Phase.</div>
                            </div>
                        )
                    }
                />
            )}
        </>
	);
};

export default SettingRow;
