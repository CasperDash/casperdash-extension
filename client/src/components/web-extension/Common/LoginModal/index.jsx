import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLoginModalOpen } from '@cd/selectors/loginModal';
import { setLoginModalOpen } from '@cd/actions/loginModalAction';
import LoginModalConfirm from './LoginModalForm';
import './LoginModal.scss';

export const LoginModal = () => {
	const isOpen = useSelector(getLoginModalOpen);
	const dispatch = useDispatch();

	const handleOnLoginSuccess = () => {
		dispatch(setLoginModalOpen(false));
	};

	return (
		<LoginModalConfirm isOpen={isOpen} onLoginSuccess={handleOnLoginSuccess} title="Your session has expired"/>
	);
};
