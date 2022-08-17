import _set from 'lodash-es/set';
import _get from 'lodash-es/get';
import isEmpty from 'lodash-es/isEmpty';

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

const setChromeStorageLocal = ({key, value} = undefined) => {
  try {
    if (!key) {
      return undefined;
    }

    if (!isUsingExtension()) {
      throw new Error("Must be running in Chrome Extension environment");
    }

    return new Promise((resolve, reject) => {
      chrome.storage.local.set({[key]: value}, () => {
          const error = chrome.runtime.lastError;
          error ? reject(error) : resolve();
      });
    });
  } catch (error) {
    console.error(`🚀 ~ setChromeStorageLocal::error `, error);
    return undefined;
  }
}

const getChromeStorageLocal = async (key) => {
  try {
    if (!key) {
      return undefined;
    }

    if (!isUsingExtension()) {
      throw new Error("Must be running in Chrome Extension environment");
    }

    /**
     * `get` might accept an array of keys, rather than only one
     * This is for testing
     */
    const finalkey = typeof key === "string" ? [key] : [...key];

    return new Promise(resolve => {
      chrome.storage.local.get(finalkey, (items) => {
        // Pass any observed errors down the promise chain.
        if (chrome.runtime.lastError) {
          throw new Error(chrome.runtime.lastError);
        }

        // Pass the data retrieved from storage down the promise chain.
        return resolve(items);
      });


    });
  } catch (error) {
    console.error(`🚀 ~ getChromeStorageLocal::error `, error);
    return undefined;
  }
}

const clearChromeStorageLocal = () => chrome.storage.local.clear();
const isUsingExtension = () => {
  try {
    return Boolean(typeof chrome !== "undefined" && !isEmpty(chrome) && "storage" in chrome)
  } catch (err) {
    return false;
  }
};

export {
  isUsingExtension,
  setLocalStorageValue,
  getLocalStorageValue,
  setChromeStorageLocal,
  getChromeStorageLocal,
  clearChromeStorageLocal
}
