import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ConfirmModal from '@cd/components/Common/ConfirmModal';
import { deleteAllUserData } from '@cd/actions/userActions';
import EnterPasswordModal from '@cd/components/web-extension/Common/LoginModal/EnterPasswordModal';
import useAuthLogin from '@cd/components/hooks/useAuthLogin';
import { getLoginOptions } from '@cd/selectors/user';
import { CONNECTION_TYPES } from '@cd/constants/settings';

const DeleteAllDataButton = () => {
	const dispatch = useDispatch();
	const { validateUserCredential } = useAuthLogin({});
	const navigate = useNavigate();
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
	const loginOptions = useSelector(getLoginOptions);

	const handleOnClick = () => {
		setIsOpenModal(true);
	};

	const onCloseModalHandler = () => {
		setIsOpenModal(false);
	};

	const onConfirmHandler = () => {
		if (loginOptions?.connectionType === CONNECTION_TYPES.ledger) {
			dispatch(deleteAllUserData());
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
		dispatch(deleteAllUserData());
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
					<div className="cd_setting_modal">
						<p>
							Your current wallet, including <strong>accounts</strong> and <strong>assets</strong>{' '}
							<strong style={{ color: '#fa2852' }}>will be removed from this device permanently</strong>.
							Please acknowledge this action <strong>cannot be undone.</strong>
						</p>
						<p>
							You can <strong>ONLY</strong> recover with your Secret CasperDash Recovery Phrase which you
							provided when setting up this wallet. Make sure you&lsquo;re having a copy of your correct
							Secret Recovery Phrase.
						</p>
					</div>
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
