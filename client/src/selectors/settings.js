export const getTheme = ({ settings }) => {
	return settings.theme;
};

export const getAutoLockTime = ({ settings }) => {
	return settings.autoLockTime;
};

export const getNetwork = ({ settings }) => {
	return settings.network || 'casper';
};

export const getExplorer = ({ settings }) => {
	return settings.network === 'casper-test' ? 'https://testnet.cspr.live' : 'https://cspr.live';
};

export const getNetworkState = (fn) => fn?.().settings?.network || 'casper';
