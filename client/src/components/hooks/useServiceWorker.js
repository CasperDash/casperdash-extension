import browser from 'webextension-polyfill';

const resultHandler = (response = {}) => {
	if (response.error) {
		throw Error(response.error);
	}
	return response.payload;
};

const useServiceWorker = () => {
	const options = {
		source: 'popup',
		destination: 'serviceWorker',
		type: 'casperlabs-plugin',
	};

	const sentMessage = async (payload) => {
		const result = await browser.runtime.sendMessage({ ...options, payload });
		return resultHandler(result);
	};

	const createUserService = async (password, keyphrase) => {
		return sentMessage({ methodName: 'accountManager.createUser', params: { password, keyphrase } });
	};

	return { createUserService };
};

export default useServiceWorker;
