import { storeFile, deleteFile } from './fileActions';

test('storeFile', () => {
	expect(storeFile('test')).toMatchObject({
		request: { data: {}, method: 'POST', url: '/file/storeFile' },
		type: 'FILES.STORE_FILE',
	});
});

test('deleteFile', () => {
	expect(deleteFile('test')).toMatchObject({
		type: 'FILES.DELETE_FILE',
		request: {
			method: 'DELETE',
			url: `/file/test`,
		},
	});
});
