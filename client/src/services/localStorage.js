import _set from 'lodash-es/set';
import _get from 'lodash-es/get';
/**
 * Set value to local storage by path
 * @param {string} key storage key
 * @param {string} path path to object value
 * @param {object} value value
 * @param {string} action push or set
 * @returns {object} new storage value
 */
export const setLocalStorageValue = (key, path, value, action) => {
	try {
		const item = JSON.parse(localStorage.getItem(key)) || {};
		let updatedItem;
		switch (action) {
			case 'set':
				updatedItem = _set(item, path, value);
				break;
			case 'push': {
				const currentValue = _get(item, path, []);
				updatedItem = _set(item, path, [...new Set([...currentValue, value])]); // unique array
				break;
			}
			default:
				updatedItem = item;
				break;
		}

		localStorage.setItem(key, JSON.stringify(updatedItem));
		return updatedItem;
	} catch (error) {
		return undefined;
	}
};

/**
 * Get value from local storage
 * @param {string} key Storage key
 * @param {string} path Object path
 */
export const getLocalStorageValue = (key, path) => {
	try {
		const item = JSON.parse(localStorage.getItem(key));
		return _get(item, path);
	} catch (error) {
		return undefined;
	}
};
