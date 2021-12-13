import { FILES } from '../store/actionTypes';

export const storeFile = (file) => {
	const formData = new FormData();
	formData.append('image', file);
	return {
		type: FILES.STORE_FILE,
		request: {
			method: 'POST',
			url: '/file/storeFile',
			data: formData,
		},
	};
};

export const deleteFile = (cid) => {
	return {
		type: FILES.DELETE_FILE,
		request: {
			method: 'DELETE',
			url: `/file/${cid}`,
		},
	};
};
