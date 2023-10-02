import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ConfirmModal from '@cd/components/Common/ConfirmModal';
import EnterPasswordModal from '@cd/components/web-extension/Common/LoginModal/EnterPasswordModal';
import useAuthLogin from '@cd/components/hooks/useAuthLogin';
import { isUsingLedgerSelector } from '@cd/selectors/user';
import { useDeleteAllData } from '@cd/hooks/useDeleteAllData';
import DeleteAllDataNotice from '@cd/web-extension/Common/DeleteAllDataNotice';

const DeleteAllDataButton = () => {
	const { deleteAllData } = useDeleteAllData();
	const { validateUserCredential } = useAuthLogin({});
	const navigate = useNavigate();
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
	const isUsingLedger = useSelector(isUsingLedgerSelector);

	const handleOnClick = () => {
		setIsOpenModal(true);
	};

	const onCloseModalHandler = () => {
		setIsOpenModal(false);
	};

	const onConfirmHandler = () => {
		if (isUsingLedger) {
			deleteAllData();
			navigate('/connectAccount');
			return;
		}
		setIsOpenModal(false);
		setIsOpenLoginModal(true);
	};

	const onSubmitPassword = async (password) => {
		const result = await validateUserCredential(password);
		if (!result) {
			throw Error('Invalid password');
		}
		setIsOpenLoginModal(false);
		deleteAllData();
		navigate('/connectAccount');
	};

	const handleOnClosePasswordModal = () => {
		setIsOpenLoginModal(false);
	};

	return (
		<>
			<Button variant="normal" className="btn--delete-all-data" onClick={handleOnClick}>
				Delete All Data
			</Button>
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
			<EnterPasswordModal
				isOpen={isOpenLoginModal}
				onSubmitPassword={onSubmitPassword}
				onCloseModal={handleOnClosePasswordModal}
				title="Confirm delete"
				description="Enter password to delete all data"
			/>
		</>
	);
};

export default DeleteAllDataButton;
