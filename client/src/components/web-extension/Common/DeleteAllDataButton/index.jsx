import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ConfirmModal from '@cd/components/Common/ConfirmModal';
import { lockAccount } from '@cd/actions/userActions';

const DeleteAllDataButton = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isOpenModal, setIsOpenModal] = useState(false);

	const handleOnClick = () => {
		setIsOpenModal(true);
	};

	const onCloseModalHandler = () => {
		setIsOpenModal(false);
	};

	const onConfirmHandler = () => {
		dispatch(lockAccount());
		navigate('/connectAccount');
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
				title="Are you sure you want to delete your wallet ?"
				description={
					<div className="cd_setting_modal">
						<div>
							Your current wallet, accounts and assets will be removed from this app permanently. This
							action cannot be undone.
						</div>
						<br />
						<div>
							Your can ONLY recover this wallet with your Secret Recovery Phase CasperDash does not have
							your Secret Recovery Phase.
						</div>
					</div>
				}
			/>
		</>
	);
};

export default DeleteAllDataButton;
