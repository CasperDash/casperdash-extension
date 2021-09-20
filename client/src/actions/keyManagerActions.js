import { KEY_MANAGER } from '../store/actionTypes';

export const fetchKeyManagerDetails = (publicKey) => ({
	type: KEY_MANAGER.FETCH_KEY_MANAGER_DETAILS,
	request: { url: `/keyManager/${publicKey}` },
});
