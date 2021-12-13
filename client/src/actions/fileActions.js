import { FILE } from '../store/actionTypes';

export const storeFile = (file) => {
	const formData = new FormData();
	formData.append('image', file);
	return {
		type: FILE.STORE_FILE,
		request: {
			method: 'POST',
			url: '/file/storeFile',
			data: formData,
		},
	};
};
