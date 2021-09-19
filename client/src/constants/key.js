const config = () => {
	try {
		return JSON.parse(localStorage.getItem('configuration'));
	} catch {
		return {};
	}
};

export const { MOTE_RATE, TESTNET_RPC_URL } = config();
export const KEY_PREFIX = ['account-hash-', 'uref-'];
export const MIN_TRANSFER = 2.5;
