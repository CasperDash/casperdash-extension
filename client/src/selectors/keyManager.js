import { getQuerySelector, getMutationSelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { KEY_MANAGER } from '../store/actionTypes';

export const keyManagerDetailsSelector = getQuerySelector({ type: KEY_MANAGER.FETCH_KEY_MANAGER_DETAILS });

export const deploySelector = getMutationSelector({ type: KEY_MANAGER.PUT_WEIGHT_DEPLOY });

export const isKeyManagerContractAvailable = createSelector(keyManagerDetailsSelector, ({ data }) => {
	if (!data || !data.namedKeys || !data.namedKeys.length) {
		return false;
	}
	return data.namedKeys.some((namedKey) => namedKey.name === 'keys_manager');
});

export const getPendingDeploys = ({ keysManager }) => {
	if (!keysManager || !keysManager.deploys) {
		return {};
	}
	const pendingDeploys = Object.keys(keysManager.deploys).reduce((out, key) => {
		out[key] = Array.isArray(keysManager.deploys[key])
			? keysManager.deploys[key].filter((deploy) => deploy.status === 'pending')
			: [];
		return out;
	}, {});
	return pendingDeploys;
};

export const getPendingDeployHashes = createSelector(getPendingDeploys, (pendingDeploys) => {
	if (!pendingDeploys) {
		return [];
	}
	return Object.keys(pendingDeploys).reduce((out, key) => {
		if (!pendingDeploys[key].length) {
			return out;
		}
		return out.concat(pendingDeploys[key].map((deploy) => deploy.hash));
	}, []);
});
