import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '@cd/components/Common/ConfirmModal';
import { isUsingLedgerSelector } from '@cd/selectors/user';
import { useDeleteAllData } from '@cd/hooks/useDeleteAllData';
import ConfirmDeleteAllDataModal from '@cd/web-extension/Common/DeleteAllDataLinkConfirm/ConfirmDeleteAllDataModal';
import DeleteAllDataNotice from '@cd/web-extension/Common/DeleteAllDataNotice';

import './index.scss';

const DeleteAllDataLinkConfirm = () => {
	const { deleteAllData } = useDeleteAllData();
	const navigate = useNavigate();
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
	useSelector(isUsingLedgerSelector);
	const handleOnClick = () => {
		setIsOpenModal(true);
	};

	const onCloseModalHandler = () => {
		setIsOpenModal(false);
	};

	const onConfirmHandler = () => {
		setIsOpenModal(false);
		setIsOpenLoginModal(true);
	};

	const onSubmit = async () => {
		setIsOpenLoginModal(false);
		deleteAllData();
		navigate('/connectAccount');
	};

	const handleOnClosePasswordModal = () => {
		setIsOpenLoginModal(false);
	};

	return (
		<>
			<a className="cd_we_delete_all_data_link" onClick={handleOnClick}>
				Delete All Data
			</a>
			<ConfirmModal
				isOpen={isOpenModal}
				onConfirm={onConfirmHandler}
				onClose={onCloseModalHandler}
				title="Delete all your Data?"
				buttonOkText="Delete data"
				description={
					<DeleteAllDataNotice />
				}
			/>
			<ConfirmDeleteAllDataModal
				isOpen={isOpenLoginModal}
				onSubmit={onSubmit}
				onCloseModal={handleOnClosePasswordModal}
			/>
		</>
	);
};

export default DeleteAllDataLinkConfirm;