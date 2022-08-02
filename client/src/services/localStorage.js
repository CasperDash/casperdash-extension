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
const setLocalStorageValue = (key, path, value, action) => {
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
const getLocalStorageValue = (key, path) => {
	try {
		const item = JSON.parse(localStorage.getItem(key));
		return _get(item, path);
	} catch (error) {
		return undefined;
	}
};

const setChromeStorageLocal = ({key, value} = undefined, cb = undefined) => {
  if (!key) {
    return undefined;
  }

  /**
   * set might accept a full {key1: value1, key2: value2} object
   * This is for testing so only passing one param
   */
  chrome.storage.local.set({
    [key]: value
  }, cb);
}

const getChromeStorageLocal = async (key) => {
  if (!key) {
    return undefined;
  }

  /**
   * `get` might accept an array of keys, rather than only one
   * This is for testing
   */
  const finalkey = typeof key === "string" ? [key] : [...key];
  
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(finalkey, (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      // Pass the data retrieved from storage down the promise chain.
      return resolve(items);
    });
  });
}

export {
  setLocalStorageValue,
  getLocalStorageValue,
  setChromeStorageLocal,
  getChromeStorageLocal
}
