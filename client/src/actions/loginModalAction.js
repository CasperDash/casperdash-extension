import { LOGIN_MODAL } from '@cd/store/actionTypes';

export const setLoginModalOpen = (isOpen) => {
	return {
		type: LOGIN_MODAL.SET_IS_OPEN,
		payload: isOpen,
	};
};