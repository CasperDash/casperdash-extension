export const getTheme = ({ settings }) => {
	return settings.theme;
};

export const getAutoLockTime = ({ settings }) => {
	return settings.autoLockTime;
};

export const getNetwork = ({ settings }) => {
	return settings.network;
};

export const getExplorer = ({ settings }) => {
	return settings.network === 'casper' ? 'https://cspr.live' : 'https://testnet.cspr.live';
};
