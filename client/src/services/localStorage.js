import _set from 'lodash-es/set';
import _get from 'lodash-es/get';

export const setLocalStorageValue = (key, path, value, action) => {
	try {
		const item = JSON.parse(localStorage.getItem(key)) || {};
		let updatedItem;
		switch (action) {
			case 'set':
				updatedItem = _set(item, path, value);
				break;
			case 'push':
				const currentValue = _get(item, path, []);
				updatedItem = _set(item, path, [...new Set([...currentValue, value])]); // unique array
				break;
			default:
				updatedItem = item;
				break;
		}

		localStorage.setItem(key, JSON.stringify(updatedItem));
		return updatedItem;
	} catch (error) {
		console.error(error);
	}
};

export const getLocalStorageValue = (key, path) => {
	try {
		const item = JSON.parse(localStorage.getItem(key));
		return _get(item, path);
	} catch (error) {
		console.error(error);
	}
};
